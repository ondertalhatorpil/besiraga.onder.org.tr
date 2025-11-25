/**
 * Dosya: frontend/src/services/api.js
 * Açıklama: Backend API ile iletişim servisi
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Genel fetch fonksiyonu
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Bir hata oluştu');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Rezervasyon API'leri
export const rezervasyonAPI = {
  // Tüm mekanları getir
  getMekanlar: async () => {
    return fetchAPI('/rezervasyon/mekanlar');
  },

  // Müsaitlik kontrolü
  musaitlikKontrol: async (data) => {
    return fetchAPI('/rezervasyon/musaitlik-kontrol', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Tarih doluluk durumu
  getTarihDoluluk: async (tarih) => {
    return fetchAPI(`/rezervasyon/tarih-doluluk/${tarih}`);
  },

  // Yeni rezervasyon oluştur
  createRezervasyon: async (data) => {
    return fetchAPI('/rezervasyon/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Rezervasyon detayı
  getRezervasyonDetay: async (id) => {
    return fetchAPI(`/rezervasyon/${id}`);
  },
};

// Admin API'leri
export const adminAPI = {
  // Login
  login: async (credentials) => {
    return fetchAPI('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Rezervasyonları listele
  getRezervasyonlar: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/admin/rezervasyonlar?${queryString}`);
  },

  // Rezervasyon detayı
  getRezervasyonDetay: async (id) => {
    return fetchAPI(`/admin/rezervasyon/${id}`);
  },

  // Rezervasyonu onayla
  onaylaRezervasyon: async (id, admin_id) => {
    return fetchAPI(`/admin/rezervasyon/${id}/onayla`, {
      method: 'PUT',
      body: JSON.stringify({ admin_id }),
    });
  },

  // Rezervasyonu reddet
  reddetRezervasyon: async (id, admin_id, red_nedeni) => {
    return fetchAPI(`/admin/rezervasyon/${id}/reddet`, {
      method: 'PUT',
      body: JSON.stringify({ admin_id, red_nedeni }),
    });
  },

  // Rezervasyonu iptal et
  iptalRezervasyon: async (id, admin_id) => {
    return fetchAPI(`/admin/rezervasyon/${id}/iptal`, {
      method: 'PUT',
      body: JSON.stringify({ admin_id }),
    });
  },

  // Dashboard istatistikleri
  getDashboardStats: async () => {
    return fetchAPI('/admin/dashboard');
  },
};

export default { rezervasyonAPI, adminAPI };