import React from 'react';

const StatCard = ({ title, value, icon, color = 'red', trend, loading = false }) => {
    const colorClasses = {
        emerald: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            text: 'text-red-700'
        },
        blue: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            text: 'text-red-700'
        },
        yellow: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            text: 'text-red-700'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            text: 'text-red-700'
        },
        purple: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            text: 'text-red-700'
        },
        teal: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            text: 'text-red-700'
        }
    };

    const colors = colorClasses[color] || colorClasses.emerald;

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900">
                        {value?.toLocaleString('tr-TR') || '0'}
                    </h3>
                    {trend && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${
                            trend.type === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {trend.type === 'up' ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            {trend.value}
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center ${colors.icon}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;