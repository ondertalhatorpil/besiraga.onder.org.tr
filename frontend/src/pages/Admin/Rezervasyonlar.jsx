import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import RezervasyonDetayModal from '../../components/admin/RezervasyonDetayModal';

const AdminRezervasyonlar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [rezervasyonlar, setRezervasyonlar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState(null);
    const [selectedRezervasyon, setSelectedRezervasyon] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filtreler
    const [filters, setFilters] = useState({
        durum: searchParams.get('durum') || '',
        tarih_baslangic: searchParams.get('tarih_baslangic') || '',
        tarih_bitis: searchParams.get('tarih_bitis') || '',
        sayfa: parseInt(searchParams.get('sayfa')) || 1,
        limit: 20
    });

    useEffect(() => {
        fetchRezervasyonlar();
    }, [filters]);

    const fetchRezervasyonlar = async () => {
        try {
            setLoading(true);
            setError('');
            
            // URL'i güncelle
            const params = {};
            if (filters.durum) params.durum = filters.durum;
            if (filters.tarih_baslangic) params.tarih_baslangic = filters.tarih_baslangic;
            if (filters.tarih_bitis) params.tarih_bitis = filters.tarih_bitis;
            if (filters.sayfa > 1) params.sayfa = filters.sayfa;
            setSearchParams(params);

            const response = await adminAPI.getRezervasyonlar(filters);
            
            if (response.success) {
                setRezervasyonlar(response.data);
                setPagination(response.pagination);
            }
        } catch (err) {
            setError(err.message || 'Rezervasyonlar yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            sayfa: 1 // Filtre değiştiğinde ilk sayfaya dön
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            sayfa: newPage
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleShowDetail = async (rezervasyonId) => {
        try {
            const response = await adminAPI.getRezervasyonDetay(rezervasyonId);
            if (response.success) {
                setSelectedRezervasyon(response.data);
                setShowModal(true);
            }
        } catch (error) {
            alert(error.message || 'Rezervasyon detayı yüklenirken hata oluştu');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRezervasyon(null);
    };

    const handleUpdate = () => {
        fetchRezervasyonlar();
    };

    const getDurumBadge = (durum) => {
        const badges = {
            beklemede: { bg: 'bg-red-100', text: 'text-red-800', label: 'Beklemede' },
            onaylandi: { bg: 'bg-red-100', text: 'text-red-800', label: 'Onaylandı' },
            reddedildi: { bg: 'bg-red-100', text: 'text-red-800', label: 'Reddedildi' },
            iptal: { bg: 'bg-red-100', text: 'text-red-800', label: 'İptal' }
        };
        
        const badge = badges[durum] || badges.beklemede;
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const clearFilters = () => {
        setFilters({
            durum: '',
            tarih_baslangic: '',
            tarih_bitis: '',
            sayfa: 1,
            limit: 20
        });
    };

    return (
        <div className="space-y-6">
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durum
                        </label>
                        <select
                            value={filters.durum}
                            onChange={(e) => handleFilterChange('durum', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="">Tümü</option>
                            <option value="beklemede">Beklemede</option>
                            <option value="onaylandi">Onaylandı</option>
                            <option value="reddedildi">Reddedildi</option>
                            <option value="iptal">İptal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Başlangıç Tarihi
                        </label>
                        <input
                            type="date"
                            value={filters.tarih_baslangic}
                            onChange={(e) => handleFilterChange('tarih_baslangic', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bitiş Tarihi
                        </label>
                        <input
                            type="date"
                            value={filters.tarih_bitis}
                            onChange={(e) => handleFilterChange('tarih_bitis', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    {/* Temizle Butonu */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full px-4 py-2 border border-red-300 text-gray-100 rounded-lg hover:bg-gray-50 transition-colors bg-red-500"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                </div>
            </div>

            {/* İstatistikler */}
            {pagination && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <p className="text-sm text-gray-600">
                        Toplam <strong className="text-gray-900">{pagination.toplamKayit}</strong> rezervasyon bulundu
                        {filters.durum && ` (${filters.durum} durumunda)`}
                    </p>
                </div>
            )}

            {/* Hata Mesajı */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Rezervasyon Listesi */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <svg className="animate-spin h-8 w-8 mx-auto text-emerald-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="mt-4 text-gray-600">Yükleniyor...</p>
                    </div>
                ) : rezervasyonlar.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mt-4 text-gray-600">Rezervasyon bulunamadı</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Kurum
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Tarih & Saat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Kişi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Durum
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            İşlem
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rezervasyonlar.map((rez) => (
                                        <tr key={rez.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                                #{rez.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {rez.kurum_adi}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {rez.yetkili_ad_soyad}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {rez.il} / {rez.ilce}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-900">
                                                    {new Date(rez.tarih).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-xs text-gray-600">{rez.saat_dilimi}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {rez.toplam_kisi} kişi
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getDurumBadge(rez.durum)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleShowDetail(rez.id)}
                                                    className="text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    Detay
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {rezervasyonlar.map((rez) => (
                                <div key={rez.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                #{rez.id} - {rez.kurum_adi}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {rez.yetkili_ad_soyad}
                                            </p>
                                        </div>
                                        {getDurumBadge(rez.durum)}
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                                        <p>📅 {new Date(rez.tarih).toLocaleDateString('tr-TR')} - {rez.saat_dilimi}</p>
                                        <p>👥 {rez.toplam_kisi} kişi</p>
                                        <p>📍 {rez.il} / {rez.ilce}</p>
                                    </div>
                                    <button
                                        onClick={() => handleShowDetail(rez.id)}
                                        className="w-full px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                                    >
                                        Detay Görüntüle
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.toplamSayfa > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <p className="text-sm text-gray-600">
                        Sayfa {pagination.sayfa} / {pagination.toplamSayfa}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.sayfa - 1)}
                            disabled={pagination.sayfa === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Önceki
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.sayfa + 1)}
                            disabled={pagination.sayfa === pagination.toplamSayfa}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sonraki
                        </button>
                    </div>
                </div>
            )}

            {/* Detay Modal */}
            {showModal && selectedRezervasyon && (
                <RezervasyonDetayModal
                    rezervasyon={selectedRezervasyon}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default AdminRezervasyonlar;