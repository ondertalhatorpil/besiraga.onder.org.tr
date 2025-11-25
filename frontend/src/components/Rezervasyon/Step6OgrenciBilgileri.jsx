/**
 * Dosya: frontend/src/components/Rezervasyon/Step6OgrenciBilgileri.jsx
 * Açıklama: Adım 6 - Öğrenci bilgileri girişi (Manuel veya Excel)
 */

import React, { useState } from 'react';
import { rezervasyonAPI } from '../../services/api';
import * as XLSX from 'xlsx';

const Step6OgrenciBilgileri = ({ formData, updateFormData, prevStep }) => {
  const [ogrenciler, setOgrenciler] = useState(formData.ogrenciler || []);
  const [yuklemeTipi, setYuklemeTipi] = useState('manuel'); // 'manuel' veya 'excel'
  const [submitLoading, setSubmitLoading] = useState(false);

  const toplamKisi = Object.values(formData.mekanlar).reduce((a, b) => a + b, 0);

  // Boş öğrenci objesi
  const bosOgrenci = {
    ad_soyad: '',
    telefon: '',
    sinif: '',
    cinsiyet: 'erkek'
  };

  // İlk yüklemede öğrenci sayısı kadar boş form oluştur
  useState(() => {
    if (ogrenciler.length === 0) {
      const yeniOgrenciler = Array(toplamKisi).fill(null).map(() => ({ ...bosOgrenci }));
      setOgrenciler(yeniOgrenciler);
    }
  }, []);

  const handleOgrenciChange = (index, field, value) => {
    const yeniOgrenciler = [...ogrenciler];
    yeniOgrenciler[index][field] = value;
    setOgrenciler(yeniOgrenciler);
  };

  const handleExcelYukle = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Excel'den gelen verileri öğrenci formatına çevir
        const excelOgrenciler = jsonData.map(row => ({
          ad_soyad: row['Ad Soyad'] || row['ad_soyad'] || '',
          telefon: row['Telefon'] || row['telefon'] || '',
          sinif: row['Sınıf'] || row['sinif'] || '',
          cinsiyet: (row['Cinsiyet'] || row['cinsiyet'] || 'erkek').toLowerCase()
        }));

        if (excelOgrenciler.length !== toplamKisi) {
          alert(`Excel'de ${excelOgrenciler.length} öğrenci var, ancak ${toplamKisi} öğrenci bilgisi gerekiyor.`);
          return;
        }

        setOgrenciler(excelOgrenciler);
        alert('Excel başarıyla yüklendi!');
      } catch (error) {
        console.error('Excel okuma hatası:', error);
        alert('Excel dosyası okunamadı. Lütfen formatı kontrol edin.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExcelIndir = () => {
    // Örnek Excel oluştur
    const ornekData = Array(toplamKisi).fill(null).map((_, i) => ({
      'Ad Soyad': `Öğrenci ${i + 1}`,
      'Telefon': '05551234567',
      'Sınıf': '9-A',
      'Cinsiyet': 'erkek'
    }));

    const worksheet = XLSX.utils.json_to_sheet(ornekData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Öğrenciler');
    XLSX.writeFile(workbook, 'ogrenci_listesi_ornek.xlsx');
  };

  const validateForm = () => {
    if (ogrenciler.length !== toplamKisi) {
      alert(`${toplamKisi} öğrenci bilgisi girmeniz gerekiyor.`);
      return false;
    }

    for (let i = 0; i < ogrenciler.length; i++) {
      const ogr = ogrenciler[i];
      if (!ogr.ad_soyad || !ogr.sinif) {
        alert(`${i + 1}. öğrencinin adı soyadı ve sınıfı zorunludur.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitLoading(true);

    try {
      // Final verileri hazırla
      const rezervasyonData = {
        yetkili_ad_soyad: formData.yetkili_ad_soyad,
        kurum_adi: formData.kurum_adi,
        kurum_tipi: formData.kurum_tipi,
        il: formData.il,
        ilce: formData.ilce,
        telefon: formData.telefon,
        tarih: formData.tarih,
        saat_dilimi: formData.saat_dilimi,
        mekanlar: formData.mekanlar,
        aciklama: formData.aciklama || '',
        ogrenciler: ogrenciler
      };

      const response = await rezervasyonAPI.createRezervasyon(rezervasyonData);

      if (response.success) {
        alert(`Rezervasyon başarıyla oluşturuldu! 
        
Rezervasyon No: ${response.data.rezervasyon_id}
Durum: Beklemede

Admin onayından sonra size bilgi verilecektir.`);
        
        // Formu sıfırla veya başka sayfaya yönlendir
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Rezervasyon oluşturma hatası:', error);
      alert('Rezervasyon oluşturulurken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Öğrenci Bilgileri</h2>
        <p className="text-gray-600">
          Toplam <span className="font-bold text-red-600">{toplamKisi} öğrenci</span> bilgisi girmeniz gerekiyor
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Yükleme Tipi Seçimi */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setYuklemeTipi('manuel')}
              className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                yuklemeTipi === 'manuel'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✍️ Manuel Giriş
            </button>
            <button
              type="button"
              onClick={() => setYuklemeTipi('excel')}
              className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                yuklemeTipi === 'excel'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Excel Yükle
            </button>
          </div>
        </div>

        {/* Excel Yükleme */}
        {yuklemeTipi === 'excel' && (
          <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-4">Excel ile Toplu Yükleme</h3>
            
            {/* Örnek İndirme */}
            <button
              type="button"
              onClick={handleExcelIndir}
              className="mb-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              📥 Örnek Excel Dosyasını İndir
            </button>

            {/* Dosya Yükleme */}
            <div className="mb-4">
              <label className="block">
                <span className="sr-only">Excel dosyası seç</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelYukle}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-500 file:text-white
                    hover:file:bg-red-600
                    file:cursor-pointer cursor-pointer"
                />
              </label>
            </div>

            {/* Format Bilgisi */}
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Excel Formatı:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Ad Soyad</strong> (zorunlu)</li>
                <li>• <strong>Telefon</strong> (opsiyonel)</li>
                <li>• <strong>Sınıf</strong> (zorunlu)</li>
                <li>• <strong>Cinsiyet</strong> (erkek veya kız)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Manuel Giriş veya Yüklenen Veriler */}
        <div className="space-y-4 mb-8 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {ogrenciler.map((ogr, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <h4 className="font-bold text-gray-700 mb-3">Öğrenci {index + 1}</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Ad Soyad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ogr.ad_soyad}
                    onChange={(e) => handleOgrenciChange(index, 'ad_soyad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Örn: Ahmet Yılmaz"
                    required
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={ogr.telefon}
                    onChange={(e) => handleOgrenciChange(index, 'telefon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="05551234567"
                  />
                </div>

                {/* Sınıf */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Sınıf <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ogr.sinif}
                    onChange={(e) => handleOgrenciChange(index, 'sinif', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Örn: 9-A"
                    required
                  />
                </div>

                {/* Cinsiyet */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cinsiyet <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={ogr.cinsiyet}
                    onChange={(e) => handleOgrenciChange(index, 'cinsiyet', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="erkek">Erkek</option>
                    <option value="kiz">Kız</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toplam Bilgi */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
          <p className="text-red-900">
            <strong>{ogrenciler.filter(o => o.ad_soyad && o.sinif).length}</strong> / {toplamKisi} öğrenci bilgisi tamamlandı
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all"
            disabled={submitLoading}
          >
            ← Geri
          </button>

          <button
            type="submit"
            className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                Gönderiliyor...
              </>
            ) : (
              <>
                ✓ Rezervasyonu Tamamla
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step6OgrenciBilgileri;