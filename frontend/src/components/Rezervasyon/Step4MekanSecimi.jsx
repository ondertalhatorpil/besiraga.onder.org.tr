/**
 * Dosya: frontend/src/components/Rezervasyon/Step4MekanSecimi.jsx
 * Açıklama: Adım 4 - Mekan seçimi ve kişi sayısı girişi
 */

import React, { useState, useEffect } from 'react';
import { rezervasyonAPI } from '../../services/api';

const Step4MekanSecimi = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [mekanlar, setMekanlar] = useState([]);
  const [seciliMekanlar, setSeciliMekanlar] = useState(formData.mekanlar || {});
  const [loading, setLoading] = useState(false);
  const [musaitlikMesaji, setMusaitlikMesaji] = useState(null);
  const [musaitlikKontrolEdiliyor, setMusaitlikKontrolEdiliyor] = useState(false);

  // Mekanları yükle
  useEffect(() => {
    loadMekanlar();
  }, []);

  // Müsaitlik kontrolü debounce ile
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(seciliMekanlar).length > 0) {
        checkMusaitlik();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [seciliMekanlar]);

  const loadMekanlar = async () => {
    setLoading(true);
    try {
      const response = await rezervasyonAPI.getMekanlar();
      if (response.success) {
        setMekanlar(response.data);
      }
    } catch (error) {
      console.error('Mekanlar yükleme hatası:', error);
      alert('Mekanlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const checkMusaitlik = async () => {
    // Toplam kişi sayısı 0 ise kontrol yapma
    const toplamKisi = Object.values(seciliMekanlar).reduce((a, b) => a + b, 0);
    if (toplamKisi === 0) {
      setMusaitlikMesaji(null);
      return;
    }

    setMusaitlikKontrolEdiliyor(true);
    try {
      const response = await rezervasyonAPI.musaitlikKontrol({
        tarih: formData.tarih,
        saat_dilimi: formData.saat_dilimi,
        mekanlar: seciliMekanlar
      });

      setMusaitlikMesaji({
        musait: response.musait,
        message: response.message,
        data: response.mekanDurumu
      });
    } catch (error) {
      console.error('Müsaitlik kontrol hatası:', error);
      setMusaitlikMesaji({
        musait: false,
        message: 'Müsaitlik kontrolü yapılırken bir hata oluştu'
      });
    } finally {
      setMusaitlikKontrolEdiliyor(false);
    }
  };

  const handleMekanToggle = (mekanAdi) => {
    const yeniSeciliMekanlar = { ...seciliMekanlar };
    
    if (yeniSeciliMekanlar[mekanAdi]) {
      // Mekan zaten seçili, kaldır
      delete yeniSeciliMekanlar[mekanAdi];
    } else {
      // Mekan seçilmemiş, ekle (varsayılan 0 kişi)
      yeniSeciliMekanlar[mekanAdi] = 0;
    }
    
    setSeciliMekanlar(yeniSeciliMekanlar);
  };

  const handleKisiSayisiChange = (mekanAdi, kisi) => {
    const kisiSayisi = parseInt(kisi) || 0;
    
    // Mekanın kapasitesini bul
    const mekan = mekanlar.find(m => m.mekan_adi === mekanAdi);
    if (mekan && kisiSayisi > mekan.kapasite) {
      alert(`${mekanAdi} maksimum ${mekan.kapasite} kişi alabilir`);
      return;
    }

    setSeciliMekanlar({
      ...seciliMekanlar,
      [mekanAdi]: kisiSayisi
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasyon
    if (Object.keys(seciliMekanlar).length === 0) {
      alert('Lütfen en az bir mekan seçin');
      return;
    }

    // Kişi sayısı kontrolü
    const toplamKisi = Object.values(seciliMekanlar).reduce((a, b) => a + b, 0);
    if (toplamKisi === 0) {
      alert('Lütfen kişi sayılarını girin');
      return;
    }

    // Müsaitlik kontrolü başarılı mı?
    if (!musaitlikMesaji || !musaitlikMesaji.musait) {
      alert('Seçtiğiniz mekanlar müsait değil. Lütfen farklı mekanlar seçin.');
      return;
    }

    updateFormData('mekanlar', seciliMekanlar);
    nextStep();
  };

  const toplamKisi = Object.values(seciliMekanlar).reduce((a, b) => a + b, 0);

  const getMekanIcon = (mekanAdi) => {
    if (mekanAdi.includes('Yemekhane')) return '';
    if (mekanAdi.includes('Atölye')) return '';
    if (mekanAdi.includes('Çardak')) return '';
    if (mekanAdi.includes('Medrese')) return '';
    if (mekanAdi.includes('Cami')) return '';
    return '📍';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-red-600 mb-2">Mekan Seçimi</h2>
       
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Mekanlar yükleniyor...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>

          {/* Mekan Kartları */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {mekanlar.map((mekan) => {
              const secili = seciliMekanlar.hasOwnProperty(mekan.mekan_adi);
              const kisiSayisi = seciliMekanlar[mekan.mekan_adi] || 0;

              return (
                <div
                  key={mekan.id}
                  className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                    secili
                      ? 'border-red-500 bg-red-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Mekan Başlığı */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getMekanIcon(mekan.mekan_adi)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{mekan.mekan_adi}</h3>
                        <p className="text-sm text-gray-600">Kapasite: {mekan.kapasite} kişi</p>
                      </div>
                    </div>

                    {/* Seçim Checkbox */}
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={secili}
                        onChange={() => handleMekanToggle(mekan.mekan_adi)}
                        className="w-6 h-6 text-red-500 border-gray-300 rounded focus:ring-red-500"
                      />
                    </label>
                  </div>

                  {/* Kişi Sayısı Girişi */}
                  {secili && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kaç kişi? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleKisiSayisiChange(
                              mekan.mekan_adi,
                              Math.max(0, kisiSayisi - 5)
                            )
                          }
                          className="w-10 h-10 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          max={mekan.kapasite}
                          value={kisiSayisi}
                          onChange={(e) =>
                            handleKisiSayisiChange(mekan.mekan_adi, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleKisiSayisiChange(
                              mekan.mekan_adi,
                              Math.min(mekan.kapasite, kisiSayisi + 5)
                            )
                          }
                          className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Maksimum: {mekan.kapasite} kişi
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Toplam Kişi Özeti */}
          {toplamKisi > 0 && (
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Toplam Kişi Sayısı:</span>
                <span className="text-3xl font-bold text-red-600">{toplamKisi} kişi</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Kapasite Kullanımı</span>
                  <span>{toplamKisi}/100</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      toplamKisi > 100 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(toplamKisi, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Müsaitlik Mesajı */}
          {musaitlikKontrolEdiliyor && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
              <p className="text-blue-700 flex items-center gap-2">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></span>
                Müsaitlik kontrol ediliyor...
              </p>
            </div>
          )}

          {musaitlikMesaji && !musaitlikKontrolEdiliyor && (
            <div
              className={`border-2 rounded-lg p-4 mb-6 ${
                musaitlikMesaji.musait
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <p
                className={`font-semibold ${
                  musaitlikMesaji.musait ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {musaitlikMesaji.musait ? '✅ Müsait!' : '❌ Uyarı!'}
              </p>
              <p
                className={`text-sm mt-1 ${
                  musaitlikMesaji.musait ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {musaitlikMesaji.message}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all"
            >
              ← Geri
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={
                toplamKisi === 0 ||
                !musaitlikMesaji ||
                !musaitlikMesaji.musait ||
                musaitlikKontrolEdiliyor
              }
            >
              Devam Et →
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Step4MekanSecimi;