
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// POST /api/admin/login - Admin girişi
router.post('/login', adminController.login);

// GET /api/admin/rezervasyonlar - Tüm rezervasyonları listele (filtreleme ile)
router.get('/rezervasyonlar', adminController.getRezervasyonlar);

// GET /api/admin/rezervasyon/:id - Rezervasyon detayı
router.get('/rezervasyon/:id', adminController.getRezervasyonDetay);

// PUT /api/admin/rezervasyon/:id/onayla - Rezervasyonu onayla
router.put('/rezervasyon/:id/onayla', adminController.onaylaRezervasyon);

// PUT /api/admin/rezervasyon/:id/reddet - Rezervasyonu reddet
router.put('/rezervasyon/:id/reddet', adminController.reddetRezervasyon);

// PUT /api/admin/rezervasyon/:id/iptal - Rezervasyonu iptal et
router.put('/rezervasyon/:id/iptal', adminController.iptalRezervasyon);

// GET /api/admin/dashboard - Dashboard istatistikleri
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;