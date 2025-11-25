import React from 'react';

const Step1KurumBilgileri = ({ formData, updateFormData, nextStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasyon (kurum_tipi KALDIRILDI)
    if (!formData.yetkili_ad_soyad || !formData.kurum_adi || !formData.il || 
        !formData.ilce || !formData.telefon) {
      alert('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    // Telefon formatı kontrolü
    const telefonRegex = /^[0-9]{10,11}$/;
    if (!telefonRegex.test(formData.telefon.replace(/\s/g, ''))) {
      alert('Lütfen geçerli bir telefon numarası girin (10-11 rakam)');
      return;
    }

    nextStep();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-red-600 mb-2">Kurum Bilgileri</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Yetkili Ad Soyad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Yetkili Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.yetkili_ad_soyad}
            onChange={(e) => updateFormData('yetkili_ad_soyad', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            placeholder="Örn: Ahmet Yılmaz"
            required
          />
        </div>

        {/* Kurum Adı */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Okul / STK / Kurum Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.kurum_adi}
            onChange={(e) => updateFormData('kurum_adi', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            placeholder="Örn: Fatih Anadolu Lisesi"
            required
          />
        </div>

        {/* Kurum Tipi KALDIRILDI */}

        {/* İl ve İlçe */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              İl <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.il}
              onChange={(e) => updateFormData('il', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              placeholder="Örn: İstanbul"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              İlçe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ilce}
              onChange={(e) => updateFormData('ilce', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              placeholder="Örn: Fatih"
              required
            />
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Telefon Numarası <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.telefon}
            onChange={(e) => updateFormData('telefon', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            placeholder="Örn: 05551234567"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            10-11 haneli telefon numarası giriniz
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
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

export default Step1KurumBilgileri;