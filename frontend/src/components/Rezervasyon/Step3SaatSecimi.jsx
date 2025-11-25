/**
 * Dosya: frontend/src/components/Rezervasyon/Step3SaatSecimi.jsx
 * Açıklama: Adım 3 - Saat dilimi seçimi ve ikram gösterimi
 */

import React, { useState, useEffect } from 'react';
import { rezervasyonAPI } from '../../services/api';

const Step3SaatSecimi = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [selectedSaat, setSelectedSaat] = useState(formData.saat_dilimi || '');
  const [saatDurumu, setSaatDurumu] = useState({});
  const [loading, setLoading] = useState(false);

  // Saat dilimleri ve ikramlar
  const saatDilimleri = [
    {
      saat: '07:00-08:30',
      baslik: '07:00 - 08:30',
      sure: '1.5 Saat',
      ikramlar: ['Kahvaltı'],
      icon: '☕',
      renk: 'orange'
    },
    {
      saat: '09:00-10:30',
      baslik: '09:00 - 10:30',
      sure: '1.5 Saat',
      ikramlar: [],
      icon: '🕐',
      renk: 'blue'
    },
    {
      saat: '11:00-12:00',
      baslik: '11:00 - 12:00',
      sure: '1 Saat',
      ikramlar: [],
      icon: '🕚',
      renk: 'blue'
    },
    {
      saat: '12:00-13:30',
      baslik: '12:00 - 13:30',
      sure: '1.5 Saat',
      ikramlar: ['Öğle Yemeği'],
      icon: '🍽️',
      renk: 'green'
    },
    {
      saat: '14:00-15:30',
      baslik: '14:00 - 15:30',
      sure: '1.5 Saat',
      ikramlar: [],
      icon: '🕑',
      renk: 'blue'
    },
    {
      saat: '16:00-17:00',
      baslik: '16:00 - 17:00',
      sure: '1 Saat',
      ikramlar: ['Waffle'],
      icon: '🧇',
      renk: 'purple'
    }
  ];

  // Tarih seçildiğinde saat durumlarını yükle
  useEffect(() => {
    if (formData.tarih) {
      loadSaatDurumu();
    }
  }, [formData.tarih]);

  const loadSaatDurumu = async () => {
    setLoading(true);
    try {
      const response = await rezervasyonAPI.getTarihDoluluk(formData.tarih);
      
      if (response.success) {
        setSaatDurumu(response.saatler);
      }
    } catch (error) {
      console.error('Saat durumu yükleme hatası:', error);
      alert('Saat bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSaatSelect = (saat) => {
    // Dolu saatleri seçmeyi engelle
    if (saatDurumu[saat]?.dolu) {
      return;
    }
    setSelectedSaat(saat);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSaat) {
      alert('Lütfen bir saat dilimi seçin');
      return;
    }

    updateFormData('saat_dilimi', selectedSaat);
    nextStep();
  };

  const getSaatRenk = (saat, dolu) => {
    if (dolu) {
      return 'bg-red-100 border-red-300 text-red-500 cursor-not-allowed';
    } else if (selectedSaat === saat) {
      return 'bg-red-500 border-red-600 text-white shadow-lg scale-105';
    } else {
      return 'bg-white border-gray-200 text-gray-700 hover:border-red-400 hover:shadow-md cursor-pointer';
    }
  };

  const getIkramRenk = (ikram) => {
    if (ikram === 'Kahvaltı') return 'bg-red-100 text-red-700';
    if (ikram === 'Öğle Yemeği') return 'bg-red-100 text-red-700';
    if (ikram === 'Waffle') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-red-600 mb-2">Saat Seçimi</h2>
        <p className="text-gray-600">
          Ziyaret saatinizi seçin • Seçili Tarih: <span className="font-bold text-red-600">
            {new Date(formData.tarih + 'T00:00:00').toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Saat bilgileri yükleniyor...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Saat Kartları */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {saatDilimleri.map((dilim) => {
              const durum = saatDurumu[dilim.saat] || {};
              const dolu = durum.dolu || false;
              const kalanKapasite = durum.kalanKapasite || 100;

              return (
                <div
                  key={dilim.saat}
                  onClick={() => handleSaatSelect(dilim.saat)}
                  className={`border-2 rounded-xl p-6 transition-all duration-300 ${getSaatRenk(
                    dilim.saat,
                    dolu
                  )}`}
                >
                  {/* Saat Başlığı */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{dilim.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold">{dilim.baslik}</h3>
                        <p className={`text-sm ${dolu ? 'text-red-400' : selectedSaat === dilim.saat ? 'text-white/80' : 'text-gray-500'}`}>
                          {dilim.sure}
                        </p>
                      </div>
                    </div>

                    {/* Durum İkonu */}
                    <div>
                      {dolu ? (
                        <span className="inline-block px-3 py-1 bg-red-200 text-red-700 text-xs font-bold rounded-full">
                          DOLU
                        </span>
                      ) : selectedSaat === dilim.saat ? (
                        <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                          SEÇİLDİ ✓
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          MÜSAİT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* İkramlar */}
                  {dilim.ikramlar.length > 0 && (
                    <div className="mb-3">
                      <p className={`text-xs font-semibold mb-2 ${selectedSaat === dilim.saat ? 'text-white/80' : 'text-gray-500'}`}>
                        İKRAMLAR:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dilim.ikramlar.map((ikram) => (
                          <span
                            key={ikram}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              selectedSaat === dilim.saat
                                ? 'bg-white/20 text-white'
                                : getIkramRenk(ikram)
                            }`}
                          >
                            {ikram}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kapasite Bilgisi */}
                  {!dolu && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className={selectedSaat === dilim.saat ? 'text-white/80' : 'text-gray-600'}>
                          Kalan Kapasite:
                        </span>
                        <span className={`font-bold ${selectedSaat === dilim.saat ? 'text-white' : 'text-green-600'}`}>
                          {kalanKapasite} kişi
                        </span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            selectedSaat === dilim.saat ? 'bg-white' : 'bg-green-500'
                          }`}
                          style={{ width: `${kalanKapasite}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Seçili Saat Özeti */}
          {selectedSaat && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Seçilen Saat:</p>
              <p className="text-xl font-bold text-green-900">
                {saatDilimleri.find(s => s.saat === selectedSaat)?.baslik}
              </p>
              {saatDilimleri.find(s => s.saat === selectedSaat)?.ikramlar.length > 0 && (
                <p className="text-sm text-green-700 mt-2">
                  İkramlar: {saatDilimleri.find(s => s.saat === selectedSaat)?.ikramlar.join(', ')}
                </p>
              )}
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
              className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!selectedSaat}
            >
              Devam Et →
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Step3SaatSecimi;