
const { promisePool } = require('../config/database');

// Admin login (basit versiyon - gerçek uygulamada JWT ve bcrypt kullanılmalı)
exports.login = async (req, res) => {
    try {
        const { kullanici_adi, sifre } = req.body;

        if (!kullanici_adi || !sifre) {
            return res.status(400).json({
                success: false,
                error: 'Kullanıcı adı ve şifre gereklidir'
            });
        }

        const [admins] = await promisePool.query(
            `SELECT id, kullanici_adi, ad_soyad, rol 
             FROM admin_kullanicilar 
             WHERE kullanici_adi = ? AND aktif = 1`,
            [kullanici_adi]
        );

        if (admins.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Kullanıcı adı veya şifre hatalı'
            });
        }

        if (sifre !== 'admin123') {
            return res.status(401).json({
                success: false,
                error: 'Kullanıcı adı veya şifre hatalı'
            });
        }

        const admin = admins[0];

        res.json({
            success: true,
            message: 'Giriş başarılı',
            data: {
                id: admin.id,
                kullanici_adi: admin.kullanici_adi,
                ad_soyad: admin.ad_soyad,
                rol: admin.rol
            }
        });

    } catch (error) {
        console.error('Login hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Giriş yapılırken hata oluştu'
        });
    }
};

// Tüm rezervasyonları listele (filtreleme ile)
exports.getRezervasyonlar = async (req, res) => {
    try {
        const { durum, tarih_baslangic, tarih_bitis, sayfa = 1, limit = 20 } = req.query;

        let query = `SELECT 
                        r.id,
                        r.yetkili_ad_soyad,
                        r.kurum_adi,
                        r.kurum_tipi,
                        r.il,
                        r.ilce,
                        r.telefon,
                        r.tarih,
                        r.saat_dilimi,
                        r.toplam_kisi,
                        r.durum,
                        r.kahvalti,
                        r.ogle_yemegi,
                        r.waffle,
                        r.mekanlar,
                        r.olusturma_tarihi,
                        r.onay_tarihi,
                        a.ad_soyad as onaylayan_admin
                     FROM rezervasyonlar r
                     LEFT JOIN admin_kullanicilar a ON r.onaylayan_admin_id = a.id
                     WHERE 1=1`;

        const params = [];

        // Durum filtresi
        if (durum) {
            query += ` AND r.durum = ?`;
            params.push(durum);
        }

        // Tarih aralığı filtresi
        if (tarih_baslangic) {
            query += ` AND r.tarih >= ?`;
            params.push(tarih_baslangic);
        }
        if (tarih_bitis) {
            query += ` AND r.tarih <= ?`;
            params.push(tarih_bitis);
        }

        // Sıralama
        query += ` ORDER BY r.olusturma_tarihi DESC`;

        // Pagination
        const offset = (sayfa - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [rezervasyonlar] = await promisePool.query(query, params);

        // Toplam kayıt sayısı
        let countQuery = `SELECT COUNT(*) as toplam FROM rezervasyonlar WHERE 1=1`;
        const countParams = [];
        
        if (durum) {
            countQuery += ` AND durum = ?`;
            countParams.push(durum);
        }
        if (tarih_baslangic) {
            countQuery += ` AND tarih >= ?`;
            countParams.push(tarih_baslangic);
        }
        if (tarih_bitis) {
            countQuery += ` AND tarih <= ?`;
            countParams.push(tarih_bitis);
        }

        const [countResult] = await promisePool.query(countQuery, countParams);
        const toplamKayit = countResult[0].toplam;

        // Mekanları parse et (güvenli şekilde)
        rezervasyonlar.forEach(rez => {
            try {
                if (rez.mekanlar) {
                    rez.mekanlar = typeof rez.mekanlar === 'string' 
                        ? JSON.parse(rez.mekanlar) 
                        : rez.mekanlar;
                } else {
                    rez.mekanlar = {};
                }
            } catch (e) {
                console.error('Mekan parse hatası (ID: ' + rez.id + '):', e);
                rez.mekanlar = {};
            }
        });

        res.json({
            success: true,
            data: rezervasyonlar,
            pagination: {
                sayfa: parseInt(sayfa),
                limit: parseInt(limit),
                toplamKayit: toplamKayit,
                toplamSayfa: Math.ceil(toplamKayit / limit)
            }
        });

    } catch (error) {
        console.error('Rezervasyon listesi hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Rezervasyonlar listelenirken hata oluştu'
        });
    }
};

// Tek bir rezervasyonun detaylarını getir (öğrenciler ile)
exports.getRezervasyonDetay = async (req, res) => {
    try {
        const { id } = req.params;

        const [rezervasyonlar] = await promisePool.query(
            `SELECT 
                r.*,
                a.ad_soyad as onaylayan_admin
             FROM rezervasyonlar r
             LEFT JOIN admin_kullanicilar a ON r.onaylayan_admin_id = a.id
             WHERE r.id = ?`,
            [id]
        );

        if (rezervasyonlar.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Rezervasyon bulunamadı'
            });
        }

        const rezervasyon = rezervasyonlar[0];
        
        // Mekanları parse et (güvenli şekilde)
        try {
            if (rezervasyon.mekanlar) {
                rezervasyon.mekanlar = typeof rezervasyon.mekanlar === 'string' 
                    ? JSON.parse(rezervasyon.mekanlar) 
                    : rezervasyon.mekanlar;
            } else {
                rezervasyon.mekanlar = {};
            }
        } catch (e) {
            console.error('Mekan parse hatası:', e);
            rezervasyon.mekanlar = {};
        }

        // Öğrencileri getir
        const [ogrenciler] = await promisePool.query(
            `SELECT * FROM ogrenciler WHERE rezervasyon_id = ? ORDER BY ad_soyad`,
            [id]
        );

        rezervasyon.ogrenciler = ogrenciler;

        res.json({
            success: true,
            data: rezervasyon
        });

    } catch (error) {
        console.error('Rezervasyon detay hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Rezervasyon detayları alınırken hata oluştu'
        });
    }
};

// Rezervasyonu onayla
exports.onaylaRezervasyon = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_id } = req.body;

        if (!admin_id) {
            return res.status(400).json({
                success: false,
                error: 'Admin ID gereklidir'
            });
        }

        // Rezervasyonu kontrol et
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

        if (rezervasyon.durum !== 'beklemede') {
            return res.status(400).json({
                success: false,
                error: `Bu rezervasyon zaten ${rezervasyon.durum} durumunda`
            });
        }

        // Rezervasyonu onayla
        await promisePool.query(
            `UPDATE rezervasyonlar 
             SET durum = 'onaylandi', 
                 onay_tarihi = NOW(), 
                 onaylayan_admin_id = ?
             WHERE id = ?`,
            [admin_id, id]
        );

        res.json({
            success: true,
            message: 'Rezervasyon başarıyla onaylandı'
        });

    } catch (error) {
        console.error('Rezervasyon onaylama hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Rezervasyon onaylanırken hata oluştu'
        });
    }
};

// Rezervasyonu reddet
exports.reddetRezervasyon = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_id, red_nedeni } = req.body;

        if (!admin_id || !red_nedeni) {
            return res.status(400).json({
                success: false,
                error: 'Admin ID ve red nedeni gereklidir'
            });
        }

        // Rezervasyonu kontrol et
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

        if (rezervasyon.durum !== 'beklemede') {
            return res.status(400).json({
                success: false,
                error: `Bu rezervasyon zaten ${rezervasyon.durum} durumunda`
            });
        }

        // Rezervasyonu reddet
        await promisePool.query(
            `UPDATE rezervasyonlar 
             SET durum = 'reddedildi', 
                 red_nedeni = ?,
                 onay_tarihi = NOW(), 
                 onaylayan_admin_id = ?
             WHERE id = ?`,
            [red_nedeni, admin_id, id]
        );

        res.json({
            success: true,
            message: 'Rezervasyon reddedildi'
        });

    } catch (error) {
        console.error('Rezervasyon reddetme hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Rezervasyon reddedilirken hata oluştu'
        });
    }
};

// Dashboard istatistikleri
exports.getDashboardStats = async (req, res) => {
    try {
        // Toplam rezervasyon sayıları
        const [durumSayilari] = await promisePool.query(
            `SELECT 
                durum,
                COUNT(*) as sayi
             FROM rezervasyonlar
             GROUP BY durum`
        );

        // Bu ayki rezervasyonlar
        const [buAy] = await promisePool.query(
            `SELECT COUNT(*) as sayi 
             FROM rezervasyonlar 
             WHERE MONTH(tarih) = MONTH(CURDATE()) 
             AND YEAR(tarih) = YEAR(CURDATE())`
        );

        // Bugünkü rezervasyonlar
        const [bugun] = await promisePool.query(
            `SELECT COUNT(*) as sayi 
             FROM rezervasyonlar 
             WHERE tarih = CURDATE()`
        );

        // Toplam ziyaretçi sayısı (onaylanmış)
        const [ziyaretci] = await promisePool.query(
            `SELECT SUM(toplam_kisi) as toplam 
             FROM rezervasyonlar 
             WHERE durum = 'onaylandi'`
        );

        // Son 7 günlük rezervasyonlar
        const [sonYediGun] = await promisePool.query(
            `SELECT 
                DATE(tarih) as tarih,
                COUNT(*) as sayi,
                SUM(toplam_kisi) as toplam_kisi
             FROM rezervasyonlar
             WHERE tarih >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY DATE(tarih)
             ORDER BY tarih DESC`
        );

        // En popüler mekanlar
        const [mekanIstatistik] = await promisePool.query(
            `SELECT mekanlar FROM rezervasyonlar WHERE durum = 'onaylandi'`
        );

        const mekanSayilari = {};
        mekanIstatistik.forEach(rez => {
            try {
                if (rez.mekanlar) {
                    const mekanlar = typeof rez.mekanlar === 'string' 
                        ? JSON.parse(rez.mekanlar) 
                        : rez.mekanlar;
                    
                    Object.keys(mekanlar).forEach(mekan => {
                        mekanSayilari[mekan] = (mekanSayilari[mekan] || 0) + 1;
                    });
                }
            } catch (e) {
                console.error('Mekan istatistik parse hatası:', e);
            }
        });

        const durumObj = {};
        durumSayilari.forEach(d => {
            durumObj[d.durum] = d.sayi;
        });

        res.json({
            success: true,
            data: {
                durum_sayilari: {
                    beklemede: durumObj.beklemede || 0,
                    onaylandi: durumObj.onaylandi || 0,
                    reddedildi: durumObj.reddedildi || 0,
                    iptal: durumObj.iptal || 0
                },
                bu_ay: buAy[0].sayi,
                bugun: bugun[0].sayi,
                toplam_ziyaretci: ziyaretci[0].toplam || 0,
                son_yedi_gun: sonYediGun,
                populer_mekanlar: mekanSayilari
            }
        });

    } catch (error) {
        console.error('Dashboard istatistikleri hatası:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
};

// Rezervasyonu iptal et (admin veya kullanıcı tarafından)
exports.iptalRezervasyon = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_id } = req.body;

        // Rezervasyonu kontrol et
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

        if (rezervasyon.durum === 'iptal') {
            return res.status(400).json({
                success: false,
                error: 'Bu rezervasyon zaten iptal edilmiş'
            });
        }

        // Rezervasyonu iptal et
        await promisePool.query(
            `UPDATE rezervasyonlar 
             SET durum = 'iptal'
             WHERE id = ?`,
            [id]
        );

        res.json({
            success: true,
            message: 'Rezervasyon iptal edildi'
        });

    } catch (error) {
        console.error('Rezervasyon iptal hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Rezervasyon iptal edilirken hata oluştu'
        });
    }
};