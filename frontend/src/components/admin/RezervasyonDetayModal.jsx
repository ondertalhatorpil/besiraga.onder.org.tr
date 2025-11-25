import React, { useState, useEffect } from 'react';
import { getAdminId } from '../../utils/adminAuth';
import { adminAPI } from '../../services/api';

const RezervasyonDetayModal = ({ rezervasyon, onClose, onUpdate }) => {
    const [actionLoading, setActionLoading] = useState(false);
    const [redNedeni, setRedNedeni] = useState('');
    const [showRedForm, setShowRedForm] = useState(false);
    const [activeTab, setActiveTab] = useState('genel'); // genel, ogrenciler

    // Modal açıldığında scroll'u kilitle
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!rezervasyon) return null;

    const handleOnayla = async () => {
        if (!window.confirm('Bu rezervasyonu onaylamak istediğinize emin misiniz?')) {
            return;
        }

        setActionLoading(true);
        try {
            const adminId = getAdminId();
            await adminAPI.onaylaRezervasyon(rezervasyon.id, adminId);
            alert('Rezervasyon başarıyla onaylandı!');
            onUpdate();
            onClose();
        } catch (error) {
            alert(error.message || 'Rezervasyon onaylanırken hata oluştu');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReddet = async () => {
        if (!redNedeni.trim()) {
            alert('Lütfen red nedeni giriniz');
            return;
        }

        if (!window.confirm('Bu rezervasyonu reddetmek istediğinize emin misiniz?')) {
            return;
        }

        setActionLoading(true);
        try {
            const adminId = getAdminId();
            await adminAPI.reddetRezervasyon(rezervasyon.id, adminId, redNedeni);
            alert('Rezervasyon reddedildi');
            onUpdate();
            onClose();
        } catch (error) {
            alert(error.message || 'Rezervasyon reddedilirken hata oluştu');
        } finally {
            setActionLoading(false);
        }
    };

    const handleIptal = async () => {
        if (!window.confirm('Bu rezervasyonu iptal etmek istediğinize emin misiniz?')) {
            return;
        }

        setActionLoading(true);
        try {
            const adminId = getAdminId();
            await adminAPI.iptalRezervasyon(rezervasyon.id, adminId);
            alert('Rezervasyon iptal edildi');
            onUpdate();
            onClose();
        } catch (error) {
            alert(error.message || 'Rezervasyon iptal edilirken hata oluştu');
        } finally {
            setActionLoading(false);
        }
    };

    const getDurumBadge = (durum) => {
        const badges = {
            beklemede: {
                bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
                border: 'border-yellow-200',
                text: 'text-yellow-800',
                icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                )
            },
            onaylandi: {
                bg: 'bg-gradient-to-r from-red-50 to-green-50',
                border: 'border-red-200',
                text: 'text-red-800',
                icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                )
            },
            reddedildi: {
                bg: 'bg-gradient-to-r from-red-50 to-rose-50',
                border: 'border-red-200',
                text: 'text-red-800',
                icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                )
            },
            iptal: {
                bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
                border: 'border-gray-300',
                text: 'text-gray-800',
                icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                )
            }
        };
        
        const labels = {
            beklemede: 'Beklemede',
            onaylandi: 'Onaylandı',
            reddedildi: 'Reddedildi',
            iptal: 'İptal Edildi'
        };

        const badge = badges[durum] || badges.beklemede;

        return (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${badge.bg} ${badge.border} ${badge.text}`}>
                {badge.icon}
                {labels[durum]}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
                {/* Header - Gradient Background */}
                <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-600 px-6 py-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                Rezervasyon Detayları
                            </h2>
                            <p className="text-sm text-red-100 mt-0.5">
                                ID: #{rezervasyon.id} • {rezervasyon.kurum_adi}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Durum Badge - Sticky */}
                <div className="px-6 py-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Rezervasyon Durumu</span>
                    {getDurumBadge(rezervasyon.durum)}
                </div>

                {/* Tab Navigation */}
                <div className="px-6 pt-4 bg-white border-b border-gray-200">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('genel')}
                            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
                                activeTab === 'genel'
                                    ? 'bg-red-50 text-red-700 border-b-2 border-red-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Genel Bilgiler
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('ogrenciler')}
                            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
                                activeTab === 'ogrenciler'
                                    ? 'bg-red-50 text-red-700 border-b-2 border-red-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Öğrenciler ({rezervasyon.ogrenciler?.length || 0})
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                    {activeTab === 'genel' && (
                        <>
                            {/* Kurum Bilgileri Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Kurum Bilgileri</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="Yetkili Adı Soyadı" value={rezervasyon.yetkili_ad_soyad} icon="👤" />
                                    <InfoItem label="Kurum Adı" value={rezervasyon.kurum_adi} icon="🏢" />
                                    <InfoItem label="İl / İlçe" value={`${rezervasyon.il} / ${rezervasyon.ilce}`} icon="📍" />
                                    <InfoItem label="Telefon" value={rezervasyon.telefon} icon="📞" />
                                </div>
                            </div>

                            {/* Rezervasyon Detayları Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Rezervasyon Detayları</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem 
                                        label="Tarih" 
                                        value={new Date(rezervasyon.tarih).toLocaleDateString('tr-TR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            weekday: 'long'
                                        })} 
                                        icon="📅" 
                                    />
                                    <InfoItem label="Saat Dilimi" value={rezervasyon.saat_dilimi} icon="⏰" />
                                    <InfoItem label="Toplam Kişi" value={`${rezervasyon.toplam_kisi} kişi`} icon="👥" />
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                                            İkramlar
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {rezervasyon.kahvalti && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 text-xs font-medium rounded-lg">
                                                    ☕ Kahvaltı
                                                </span>
                                            )}
                                            {rezervasyon.ogle_yemegi && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-lg">
                                                    🍽️ Öğle Yemeği
                                                </span>
                                            )}
                                            {rezervasyon.waffle && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 text-xs font-medium rounded-lg">
                                                    🧇 Waffle
                                                </span>
                                            )}
                                            {!rezervasyon.kahvalti && !rezervasyon.ogle_yemegi && !rezervasyon.waffle && (
                                                <span className="text-sm text-gray-500 italic">İkram yok</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mekanlar Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Mekanlar</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {Object.entries(rezervasyon.mekanlar).map(([mekan, kisi]) => (
                                        <div key={mekan} className="group p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-red-50 hover:to-red-50 border border-gray-200 hover:border-red-300 rounded-xl transition-all duration-300 hover:shadow-md">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">{mekan}</span>
                                                <span className="px-2.5 py-1 bg-white border border-red-200 text-red-700 font-bold text-sm rounded-lg shadow-sm">
                                                    {kisi} kişi
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Açıklama */}
                            {rezervasyon.aciklama && (
                                <div className="bg-gradient-to-br from-red-50 to-red-50 border border-red-200 rounded-xl p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-red-900 mb-2">Açıklama / Notlar</h3>
                                            <p className="text-sm text-red-800 leading-relaxed">{rezervasyon.aciklama}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Red Nedeni */}
                            {rezervasyon.red_nedeni && (
                                <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-red-900 mb-2">Red Nedeni</h3>
                                            <p className="text-sm text-red-800 leading-relaxed">{rezervasyon.red_nedeni}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Zaman Damgaları */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Oluşturulma</p>
                                            <p className="text-gray-900 font-semibold">
                                                {new Date(rezervasyon.olusturma_tarihi).toLocaleString('tr-TR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {rezervasyon.onay_tarihi && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">İşlem Tarihi</p>
                                                <p className="text-gray-900 font-semibold">
                                                    {new Date(rezervasyon.onay_tarihi).toLocaleString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'ogrenciler' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {rezervasyon.ogrenciler && rezervasyon.ogrenciler.length > 0 ? (
                                <>
                                    <div className="p-4 bg-gradient-to-r from-red-50 to-red-50 border-b border-red-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Öğrenci Listesi
                                            </h3>
                                            <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                                                {rezervasyon.ogrenciler.length} Kişi
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ad Soyad</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sınıf</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cinsiyet</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Telefon</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {rezervasyon.ogrenciler.map((ogrenci, index) => (
                                                    <tr key={ogrenci.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-500 rounded-lg flex items-center justify-center">
                                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm font-semibold text-gray-900">{ogrenci.ad_soyad}</p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                                {ogrenci.sinif}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                                ogrenci.cinsiyet === 'erkek' 
                                                                    ? 'bg-red-100 text-red-700' 
                                                                    : 'bg-pink-100 text-pink-700'
                                                            }`}>
                                                                {ogrenci.cinsiyet === 'erkek' ? '👦 Erkek' : '👧 Kız'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {ogrenci.telefon || <span className="text-gray-400 italic">-</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="p-12 text-center">
                                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="text-gray-600">Öğrenci bilgisi bulunmuyor</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                {rezervasyon.durum === 'beklemede' && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-white">
                        {!showRedForm ? (
                            <div className="flex flex-wrap gap-3 justify-end">
                                <button
                                    onClick={() => setShowRedForm(true)}
                                    disabled={actionLoading}
                                    className="px-6 py-3 bg-white border-2 border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-200 disabled:opacity-50 font-semibold flex items-center gap-2 shadow-sm hover:shadow"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reddet
                                </button>
                                <button
                                    onClick={handleOnayla}
                                    disabled={actionLoading}
                                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-600 text-white rounded-xl hover:from-red-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                                >
                                    {actionLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            İşleniyor...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Onayla
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                    <label className="block text-sm font-semibold text-red-900 mb-2">
                                        Red Nedeni <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={redNedeni}
                                        onChange={(e) => setRedNedeni(e.target.value)}
                                        placeholder="Rezervasyonun neden reddedildiğini detaylı bir şekilde açıklayınız..."
                                        className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                        rows="4"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => {
                                            setShowRedForm(false);
                                            setRedNedeni('');
                                        }}
                                        disabled={actionLoading}
                                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                                    >
                                        Vazgeç
                                    </button>
                                    <button
                                        onClick={handleReddet}
                                        disabled={actionLoading || !redNedeni.trim()}
                                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
                                    >
                                        Reddet ve Kaydet
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {rezervasyon.durum === 'onaylandi' && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-white flex justify-end">
                        <button
                            onClick={handleIptal}
                            disabled={actionLoading}
                            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 font-semibold flex items-center gap-2 shadow-sm hover:shadow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            İptal Et
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Component - InfoItem
const InfoItem = ({ label, value, icon }) => (
    <div className="group">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            {label}
        </label>
        <div className="flex items-center gap-2">
            {icon && <span className="text-xl">{icon}</span>}
            <p className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                {value}
            </p>
        </div>
    </div>
);

export default RezervasyonDetayModal;