/**
 * Dosya: frontend/src/components/Rezervasyon/Step5Aciklama.jsx
 * Açıklama: Adım 5 - Opsiyonel açıklama girişi
 */

import React, { useState } from 'react';

const Step5Aciklama = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [aciklama, setAciklama] = useState(formData.aciklama || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData('aciklama', aciklama);
    nextStep();
  };

  const karakterSayisi = aciklama.length;
  const maxKarakter = 500;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Açıklama</h2>
        <p className="text-gray-600">
          Eklemek istediğiniz bir açıklama veya not varsa yazabilirsiniz (opsiyonel)
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Özet Bilgiler */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Rezervasyon Özeti
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Kurum:</p>
              <p className="font-bold text-gray-900">{formData.kurum_adi}</p>
            </div>
            <div>
              <p className="text-gray-600">Yetkili:</p>
              <p className="font-bold text-gray-900">{formData.yetkili_ad_soyad}</p>
            </div>
            <div>
              <p className="text-gray-600">Tarih:</p>
              <p className="font-bold text-gray-900">
                {new Date(formData.tarih + 'T00:00:00').toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Saat:</p>
              <p className="font-bold text-gray-900">{formData.saat_dilimi}</p>
            </div>
            <div>
              <p className="text-gray-600">Mekanlar:</p>
              <p className="font-bold text-gray-900">
                {Object.keys(formData.mekanlar).join(', ')}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Toplam Kişi:</p>
              <p className="font-bold text-gray-900">
                {Object.values(formData.mekanlar).reduce((a, b) => a + b, 0)} kişi
              </p>
            </div>
          </div>
        </div>

        {/* Açıklama Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Açıklama / Notlar
            <span className="text-gray-400 font-normal ml-2">(Opsiyonel)</span>
          </label>
          <textarea
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            maxLength={maxKarakter}
            rows="6"
            placeholder="Örneğin: 
- Özel bir program düşünüyorsanız
- Belirli ihtiyaçlarınız varsa
- Önemli bir detay varsa
            
Buraya yazabilirsiniz..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
          ></textarea>
          
          {/* Karakter Sayacı */}
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Notlarınızı yazarak rezervasyon sürecinizi hızlandırabilirsiniz
            </p>
            <p className={`text-xs ${karakterSayisi > maxKarakter * 0.9 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
              {karakterSayisi} / {maxKarakter}
            </p>
          </div>
        </div>

        {/* Örnek Açıklamalar */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Örnek Açıklamalar
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <button
              type="button"
              onClick={() => setAciklama('Tarih ve kültür gezisi programımız kapsamında ziyaret edeceğiz.')}
              className="block w-full text-left p-2 hover:bg-blue-100 rounded transition"
            >
              "Tarih ve kültür gezisi programımız kapsamında ziyaret edeceğiz."
            </button>
            <button
              type="button"
              onClick={() => setAciklama('9. sınıf öğrencilerimizle eğitim amaçlı geleceğiz. Sesli rehber hizmeti almak istiyoruz.')}
              className="block w-full text-left p-2 hover:bg-blue-100 rounded transition"
            >
              "9. sınıf öğrencilerimizle eğitim amaçlı geleceğiz."
            </button>
            <button
              type="button"
              onClick={() => setAciklama('STK olarak gençlik etkinliği düzenliyoruz. Fotoğraf çekimi yapacağız.')}
              className="block w-full text-left p-2 hover:bg-blue-100 rounded transition"
            >
              "STK olarak gençlik etkinliği düzenliyoruz."
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            ℹ️ Bu açıklama yönetici tarafından görülecektir. Rezervasyon değerlendirmesinde 
            yardımcı olabilecek bilgileri paylaşabilirsiniz.
          </p>
        </div>

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
            className="px-8 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-xl"
          >
            Devam Et →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step5Aciklama;