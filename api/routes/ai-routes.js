const express = require('express');
const router = express.Router();
const AIService = require('../services/ai-service');

// Endpoint untuk Chat / Tanya Jawab
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Pesan (message) wajib diisi' });
        }
        
        const response = await AIService.chat(message);
        res.json({ reply: response });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memproses permintaan AI', details: error.message });
    }
});

// Endpoint untuk Analisis Dokumen
router.post('/analyze', async (req, res) => {
    try {
        const { documentText } = req.body;
        if (!documentText) {
            return res.status(400).json({ error: 'Teks dokumen (documentText) wajib diisi' });
        }
        
        const response = await AIService.analyzeDocument(documentText);
        res.json({ analysis: response });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menganalisis dokumen', details: error.message });
    }
});

// Endpoint untuk Legal Drafting
router.post('/draft', async (req, res) => {
    try {
        const { type, context } = req.body;
        if (!type || !context) {
            return res.status(400).json({ error: 'Tipe draft (type) dan konteks (context) wajib diisi' });
        }
        
        const response = await AIService.createDraft(type, context);
        res.json({ draft: response });
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat draft dokumen', details: error.message });
    }
});

module.exports = router;
