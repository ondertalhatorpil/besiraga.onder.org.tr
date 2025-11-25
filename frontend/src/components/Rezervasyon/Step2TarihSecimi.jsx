/**
 * Dosya: frontend/src/components/Rezervasyon/Step2TarihSecimi.jsx
 * Açıklama: Adım 2 - Tarih seçimi (geçmiş tarihler ve dolu günler disabled)
 */

import React, { useState, useEffect } from 'react';
import { rezervasyonAPI } from '../../services/api';

const Step2TarihSecimi = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formData.tarih || '');
  const [doluGunler, setDoluGunler] = useState({});
  const [loading, setLoading] = useState(false);

  // Ay değiştiğinde dolu günleri yükle
  useEffect(() => {
    loadDoluGunler();
  }, [currentMonth]);

  // Seçili tarih varsa onu state'e al
  useEffect(() => {
    if (formData.tarih) {
      setSelectedDate(formData.tarih);
    }
  }, [formData.tarih]);

  const loadDoluGunler = async () => {
    setLoading(true);
    try {
      const yil = currentMonth.getFullYear();
      const ay = currentMonth.getMonth() + 1;
      const gunSayisi = new Date(yil, ay, 0).getDate();

      const doluGunlerTemp = {};

      // Her gün için doluluk kontrolü yap
      for (let gun = 1; gun <= gunSayisi; gun++) {
        const tarih = `${yil}-${String(ay).padStart(2, '0')}-${String(gun).padStart(2, '0')}`;
        
        try {
          const response = await rezervasyonAPI.getTarihDoluluk(tarih);
          
          if (response.success) {
            const saatler = response.saatler;
            // Tüm saatler dolu mu kontrol et
            const tumSaatlerDolu = Object.values(saatler).every(saat => saat.dolu);
            doluGunlerTemp[tarih] = tumSaatlerDolu;
          }
        } catch (error) {
          console.error(`Tarih doluluk hatası (${tarih}):`, error);
        }
      }

      setDoluGunler(doluGunlerTemp);
    } catch (error) {
      console.error('Dolu günler yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (tarih) => {
    setSelectedDate(tarih);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert('Lütfen bir tarih seçin');
      return;
    }

    updateFormData('tarih', selectedDate);
    nextStep();
  };

  // Takvim render fonksiyonları
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDatePast = (tarih) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(tarih);
    return checkDate < today;
  };

  const isDateFull = (tarih) => {
    return doluGunler[tarih] === true;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    const days = [];
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    // Boş günler (ayın başlangıcından önceki)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Günler
    for (let day = 1; day <= daysInMonth; day++) {
      const tarih = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = isDatePast(tarih);
      const isFull = isDateFull(tarih);
      const isSelected = selectedDate === tarih;

      let dayClass = 'p-3 text-center rounded-lg cursor-pointer transition-all ';

      if (isPast) {
        // Geçmiş tarihler
        dayClass += 'bg-gray-100 text-gray-400 cursor-not-allowed';
      } else if (isFull) {
        // Dolu günler
        dayClass += 'bg-red-100 text-red-500 cursor-not-allowed';
      } else if (isSelected) {
        // Seçili gün
        dayClass += 'bg-red-500 text-white font-bold scale-110 shadow-lg';
      } else {
        // Seçilebilir günler
        dayClass += 'bg-green-50 text-green-700 hover:bg-green-100 hover:scale-105';
      }

      days.push(
        <div
          key={day}
          className={dayClass}
          onClick={() => !isPast && !isFull && handleDateSelect(tarih)}
        >
          <div className="font-semibold">{day}</div>
          {isFull && <div className="text-xs mt-1">DOLU</div>}
        </div>
      );
    }

    return (
      <div className="mt-6">
        {/* Ay Navigasyonu */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(newMonth.getMonth() - 1);
              setCurrentMonth(newMonth);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Önceki
          </button>

          <h3 className="text-2xl font-bold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>

          <button
            type="button"
            onClick={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(newMonth.getMonth() + 1);
              setCurrentMonth(newMonth);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Sonraki →
          </button>
        </div>

        {/* Haftanın Günleri */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(day => (
            <div key={day} className="text-center font-bold text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Günler */}
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>

        {loading && (
          <div className="text-center mt-4 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
            <p className="mt-2">Doluluk durumu kontrol ediliyor...</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-red-600 mb-2">Tarih Seçimi</h2>
      </div>

      {/* Renk Açıklamaları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded"></div>
          <div>
            <p className="font-semibold text-gray-700">Geçmiş</p>
            <p className="text-xs text-gray-500">Seçilemez</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
          <div className="w-8 h-8 bg-red-100 border-2 border-red-300 rounded"></div>
          <div>
            <p className="font-semibold text-red-700">Dolu</p>
            <p className="text-xs text-red-500">Tüm saatler rezerve</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <div className="w-8 h-8 bg-green-100 border-2 border-green-300 rounded"></div>
          <div>
            <p className="font-semibold text-green-700">Müsait</p>
            <p className="text-xs text-green-500">Rezerve edilebilir</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Takvim */}
        {renderCalendar()}

        {/* Seçili Tarih Gösterimi */}
        {selectedDate && (
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Seçilen Tarih:</p>
            <p className="text-xl font-bold text-amber-900">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
              })}
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
            className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!selectedDate}
          >
            Devam Et →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2TarihSecimi;