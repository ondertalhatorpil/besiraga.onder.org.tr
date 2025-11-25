const { promisePool } = require('../config/database');

// Saat dilimlerinin ikram bilgileri
const SAAT_IKRAMLARI = {
    '07:00-08:30': { kahvalti: true, ogle_yemegi: false, waffle: false },
    '09:00-10:30': { kahvalti: false, ogle_yemegi: false, waffle: false },
    '11:00-12:00': { kahvalti: false, ogle_yemegi: false, waffle: false },
    '12:00-13:30': { kahvalti: false, ogle_yemegi: true, waffle: false },
    '14:00-15:30': { kahvalti: false, ogle_yemegi: false, waffle: false },
    '16:00-17:00': { kahvalti: false, ogle_yemegi: false, waffle: true }
};

// Tüm mekanları getir
exports.getMekanlar = async (req, res) => {
    try {
        const [mekanlar] = await promisePool.query(
            'SELECT * FROM mekanlar WHERE aktif = 1 ORDER BY sira_no'
        );
        
        res.json({
            success: true,
            data: mekanlar
        });
    } catch (error) {
        console.error('Mekan listesi hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Mekanlar yüklenirken hata oluştu'
        });
    }
};

// Müsaitlik kontrolü
exports.musaitlikKontrol = async (req, res) => {
    try {
        const { tarih, saat_dilimi, mekanlar } = req.body;

        // Validation
        if (!tarih || !saat_dilimi || !mekanlar) {
            return res.status(400).json({
                success: false,
                error: 'Tarih, saat dilimi ve mekan bilgileri gereklidir'
            });
        }

        // Seçilen tarih ve saatte mevcut rezervasyonları getir
        const [mevcutRezervasyonlar] = await promisePool.query(
            `SELECT mekanlar, toplam_kisi 
             FROM rezervasyonlar 
             WHERE tarih = ? 
             AND saat_dilimi = ? 
             AND durum IN ('onaylandi', 'beklemede')`,
            [tarih, saat_dilimi]
        );

        // Mekan doluluk hesapla
        const doluMekanlar = new Set();
        let yemekhaneToplam = 0;
        let toplamDoluKisi = 0;

        mevcutRezervasyonlar.forEach(rez => {
            let rezMekanlar;
            
            if (typeof rez.mekanlar === 'string') {
                try {
                    rezMekanlar = JSON.parse(rez.mekanlar);
                } catch (e) {
                    console.error('JSON parse hatası:', e);
                    rezMekanlar = {};
                }
            } else {
                rezMekanlar = rez.mekanlar || {};
            }
            
            Object.entries(rezMekanlar).forEach(([mekan, kisi]) => {
                if (mekan === 'Yemekhane') {
                    yemekhaneToplam += kisi;
                } else {
                    doluMekanlar.add(mekan);
                }
                toplamDoluKisi += kisi;
            });
        });

        // İstenen mekanların müsaitliğini kontrol et
        const istenenToplamKisi = Object.values(mekanlar).reduce((a, b) => a + b, 0);
        
        // Kural 1: Yemekhane 100 kişi doluysa başka HİÇBİR mekan alınamaz
        if (yemekhaneToplam >= 100) {
            return res.json({
                success: false,
                musait: false,
                message: 'Bu saatte Yemekhane tam dolu olduğu için başka mekan rezervasyonu yapılamıyor.'
            });
        }

        // Kural 2: Toplam kapasite 100 kişiyi geçemez
        if (toplamDoluKisi + istenenToplamKisi > 100) {
            return res.json({
                success: false,
                musait: false,
                message: `Bu saat için sadece ${100 - toplamDoluKisi} kişilik kapasite kaldı. Siz ${istenenToplamKisi} kişi için rezervasyon yapmak istiyorsunuz.`
            });
        }

        // Kural 3: İstenen mekanlar dolu mu kontrol et
        for (const [mekan, istenenKisi] of Object.entries(mekanlar)) {
            if (mekan === 'Yemekhane') {
                const kalanYemekhane = 100 - yemekhaneToplam;
                if (istenenKisi > kalanYemekhane) {
                    return res.json({
                        success: false,
                        musait: false,
                        message: `Yemekhane için sadece ${kalanYemekhane} kişilik kapasite kaldı. Siz ${istenenKisi} kişi talep ettiniz.`
                    });
                }
            } else {
                if (doluMekanlar.has(mekan)) {
                    return res.json({
                        success: false,
                        musait: false,
                        message: `${mekan} bu saatte başka bir kurum tarafından rezerve edilmiş.`
                    });
                }

                const [mekanBilgi] = await promisePool.query(
                    'SELECT kapasite FROM mekanlar WHERE mekan_adi = ? AND aktif = 1',
                    [mekan]
                );

                if (mekanBilgi.length === 0) {
                    return res.json({
                        success: false,
                        musait: false,
                        message: `${mekan} bulunamadı veya aktif değil.`
                    });
                }

                const kapasite = mekanBilgi[0].kapasite;
                if (istenenKisi > kapasite) {
                    return res.json({
                        success: false,
                        musait: false,
                        message: `${mekan} maksimum ${kapasite} kişiliktir. Siz ${istenenKisi} kişi talep ettiniz.`
                    });
                }
            }
        }

        res.json({
            success: true,
            musait: true,
            message: 'Seçtiğiniz mekanlar ve saat müsait!',
            kalanKapasite: 100 - toplamDoluKisi,
            mekanDurumu: {
                yemekhane_dolu: yemekhaneToplam,
                yemekhane_kalan: 100 - yemekhaneToplam,
                dolu_mekanlar: Array.from(doluMekanlar)
            }
        });

    } catch (error) {
        console.error('Müsaitlik kontrol hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Müsaitlik kontrolü yapılırken hata oluştu'
        });
    }
};

// Belirli bir tarih için tüm saatlerin doluluk durumu
exports.getTarihDoluluk = async (req, res) => {
    try {
        const { tarih } = req.params;

        if (!tarih) {
            return res.status(400).json({
                success: false,
                error: 'Tarih parametresi gereklidir'
            });
        }

        const saatDoluluk = {};
        const saatDilimleri = ['07:00-08:30', '09:00-10:30', '11:00-12:00', '12:00-13:30', '14:00-15:30', '16:00-17:00'];

        for (const saat of saatDilimleri) {
            const [rezervasyonlar] = await promisePool.query(
                `SELECT SUM(toplam_kisi) as toplam 
                 FROM rezervasyonlar 
                 WHERE tarih = ? 
                 AND saat_dilimi = ? 
                 AND durum IN ('onaylandi', 'beklemede')`,
                [tarih, saat]
            );

            const toplamKisi = rezervasyonlar[0].toplam || 0;
            saatDoluluk[saat] = {
                dolu: toplamKisi >= 100,
                toplamKisi: toplamKisi,
                kalanKapasite: 100 - toplamKisi,
                ikramlar: SAAT_IKRAMLARI[saat]
            };
        }

        res.json({
            success: true,
            tarih: tarih,
            saatler: saatDoluluk
        });

    } catch (error) {
        console.error('Tarih doluluk hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Tarih doluluk bilgisi alınırken hata oluştu'
        });
    }
};

// Yeni rezervasyon oluştur (KURUM_TIPI KALDIRILDI)
exports.createRezervasyon = async (req, res) => {
    const connection = await promisePool.getConnection();
    
    try {
        await connection.beginTransaction();

        const {
            yetkili_ad_soyad,
            kurum_adi,
            il,
            ilce,
            telefon,
            tarih,
            saat_dilimi,
            mekanlar,
            aciklama,
            ogrenciler
        } = req.body;

        // Validation (kurum_tipi KALDIRILDI)
        if (!yetkili_ad_soyad || !kurum_adi || !il || !ilce || !telefon || !tarih || !saat_dilimi || !mekanlar || !ogrenciler) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                error: 'Tüm zorunlu alanlar doldurulmalıdır'
            });
        }

        // Toplam kişi sayısını hesapla
        const toplam_kisi = Object.values(mekanlar).reduce((a, b) => a + b, 0);

        // Öğrenci sayısı kontrolü
        if (ogrenciler.length !== toplam_kisi) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                error: `Öğrenci sayısı (${ogrenciler.length}) toplam kişi sayısı (${toplam_kisi}) ile eşleşmiyor`
            });
        }

        // İkram bilgilerini belirle
        const ikramlar = SAAT_IKRAMLARI[saat_dilimi];

        // Rezervasyonu kaydet (kurum_tipi KALDIRILDI)
        const [result] = await connection.query(
            `INSERT INTO rezervasyonlar 
            (yetkili_ad_soyad, kurum_adi, il, ilce, telefon, tarih, saat_dilimi, 
             kahvalti, ogle_yemegi, waffle, mekanlar, toplam_kisi, aciklama, durum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'beklemede')`,
            [
                yetkili_ad_soyad,
                kurum_adi,
                il,
                ilce,
                telefon,
                tarih,
                saat_dilimi,
                ikramlar.kahvalti,
                ikramlar.ogle_yemegi,
                ikramlar.waffle,
                JSON.stringify(mekanlar),
                toplam_kisi,
                aciklama || null
            ]
        );

        const rezervasyon_id = result.insertId;

        // Öğrencileri kaydet
        for (const ogrenci of ogrenciler) {
            await connection.query(
                `INSERT INTO ogrenciler (rezervasyon_id, ad_soyad, telefon, sinif, cinsiyet)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    rezervasyon_id,
                    ogrenci.ad_soyad,
                    ogrenci.telefon || null,
                    ogrenci.sinif,
                    ogrenci.cinsiyet
                ]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Rezervasyon başarıyla oluşturuldu. Admin onayı bekleniyor.',
            data: {
                rezervasyon_id: rezervasyon_id,
                durum: 'beklemede'
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Rezervasyon oluşturma hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Rezervasyon oluşturulurken hata oluştu',
            details: error.message
        });
    } finally {
        connection.release();
    }
};

// Rezervasyon detaylarını getir
exports.getRezervasyonDetay = async (req, res) => {
    try {
        const { id } = req.params;

        const [rezervasyonlar] = await promisePool.query(
            `SELECT * FROM rezervasyonlar WHERE id = ?`,
            [id]
        );

        if (rezervasyonlar.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Rezervasyon bulunamadı'
            });
        }

        const rezervasyon = rezervasyonlar[0];

        // Öğrencileri getir
        const [ogrenciler] = await promisePool.query(
            `SELECT * FROM ogrenciler WHERE rezervasyon_id = ?`,
            [id]
        );

        // Mekanlar parse et
        if (typeof rezervasyon.mekanlar === 'string') {
            rezervasyon.mekanlar = JSON.parse(rezervasyon.mekanlar);
        }
        
        rezervasyon.ogrenciler = ogrenciler;

        res.json({
            success: true,
            data: rezervasyon
        });

    } catch (error) {
        console.error('Rezervasyon detay hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Rezervasyon bilgileri alınırken hata oluştu'
        });
    }
};