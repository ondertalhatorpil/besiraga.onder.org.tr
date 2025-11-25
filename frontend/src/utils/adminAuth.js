/**
 * Admin Authentication Utilities
 */

// Admin bilgilerini localStorage'a kaydet
export const setAdminData = (adminData) => {
    localStorage.setItem('adminData', JSON.stringify(adminData));
};

// Admin bilgilerini localStorage'dan al
export const getAdminData = () => {
    const data = localStorage.getItem('adminData');
    return data ? JSON.parse(data) : null;
};

// Admin çıkış yap
export const logout = () => {
    localStorage.removeItem('adminData');
    window.location.href = '/admin/login';
};

// Admin giriş yapmış mı kontrol et
export const isAuthenticated = () => {
    return !!getAdminData();
};

// Admin ID'sini al
export const getAdminId = () => {
    const adminData = getAdminData();
    return adminData ? adminData.id : null;
};

// Admin adını al
export const getAdminName = () => {
    const adminData = getAdminData();
    return adminData ? adminData.ad_soyad : '';
};

// Admin rolünü al
export const getAdminRole = () => {
    const adminData = getAdminData();
    return adminData ? adminData.rol : '';
};