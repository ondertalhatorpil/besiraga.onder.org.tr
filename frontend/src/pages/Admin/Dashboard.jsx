import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/admin/StatCard';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getDashboardStats();
            
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            setError(err.message || 'İstatistikler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // İstatistik kartları için iconlar
    const icons = {
        beklemede: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        onaylandi: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        reddedildi: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        ziyaretci: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        bugun: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        buAy: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
           

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Bekleyen Rezervasyonlar"
                    value={stats?.durum_sayilari?.beklemede}
                    icon={icons.beklemede}
                    color="yellow"
                    loading={loading}
                />
                <StatCard
                    title="Onaylanan Rezervasyonlar"
                    value={stats?.durum_sayilari?.onaylandi}
                    icon={icons.onaylandi}
                    color="emerald"
                    loading={loading}
                />
                <StatCard
                    title="Reddedilen Rezervasyonlar"
                    value={stats?.durum_sayilari?.reddedildi}
                    icon={icons.reddedildi}
                    color="red"
                    loading={loading}
                />
                <StatCard
                    title="Toplam Ziyaretçi"
                    value={stats?.toplam_ziyaretci}
                    icon={icons.ziyaretci}
                    color="blue"
                    loading={loading}
                />
                <StatCard
                    title="Bugünkü Rezervasyonlar"
                    value={stats?.bugun}
                    icon={icons.bugun}
                    color="purple"
                    loading={loading}
                />
                <StatCard
                    title="Bu Ay Toplam"
                    value={stats?.bu_ay}
                    icon={icons.buAy}
                    color="teal"
                    loading={loading}
                />
            </div>

           <div className='flex justify-center text-gray-500 mt-8'>
            2025 © ÖNDER. Her Hakkı Saklıdır
           </div>
        </div>
    );
};

export default AdminDashboard;