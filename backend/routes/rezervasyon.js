/**
 * Dosya: backend/routes/rezervasyon.js
 * Açıklama: Rezervasyon endpoint'leri için route tanımları
 */

const express = require('express');
const router = express.Router();
const rezervasyonController = require('../controllers/rezervasyonController');

// GET /api/rezervasyon/mekanlar - Tüm mekanları listele
router.get('/mekanlar', rezervasyonController.getMekanlar);

// POST /api/rezervasyon/musaitlik-kontrol - Müsaitlik kontrolü yap
router.post('/musaitlik-kontrol', rezervasyonController.musaitlikKontrol);

// GET /api/rezervasyon/tarih-doluluk/:tarih - Belirli tarih için doluluk durumu
router.get('/tarih-doluluk/:tarih', rezervasyonController.getTarihDoluluk);

// POST /api/rezervasyon/create - Yeni rezervasyon oluştur
router.post('/create', rezervasyonController.createRezervasyon);

// GET /api/rezervasyon/:id - Rezervasyon detaylarını getir
router.get('/:id', rezervasyonController.getRezervasyonDetay);

module.exports = router;