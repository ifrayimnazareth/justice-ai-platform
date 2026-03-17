// Backend API Entry Point - Express.js Node Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---- Mocking Routes instead of separate files for standalone run capability ----

// 1. Auth & Auth Routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Dummy check
    if (email && password) {
        return res.json({
            success: true,
            message: 'Login Berhasil. Token digenerate.',
            token: 'jwt_mock_token_abc123',
            user: { role: 'lawyer', name: 'Budi Santoso'}
        });
    }
    return res.status(401).json({ success: false, message: 'Email atau sandi salah' });
});

// 2. AI Service Routes (NLP / Analysis)
app.post('/api/ai/probability', (req, res) => {
    const { category, caseDescription, evidences } = req.body;
    
    // In Production: This calls a Python ML Engine or OpenAI API to parse rules
    // Here we simulate the AI logic
    
    let baseWinRate = 50; 
    let analysisMsg = "";

    if (evidences && evidences.includes('Surat Perjanjian Asli')) {
        baseWinRate += 25;
        analysisMsg += "Perjanjian tertulis menguatkan hak subjek hukum secara materiil. ";
    }
    if (evidences && evidences.includes('Bukti Transfer Bank')) {
        baseWinRate += 10;
        analysisMsg += "Adanya bukti transaksi mempermudah pembuktian wanprestasi. ";
    }

    // Ensure it caps cleanly
    let finalWinRate = Math.min(baseWinRate, 95);

    res.json({
        success: true,
        calculation: {
            winRate: finalWinRate,
            confidenceScore: 0.92,
            verdict: finalWinRate >= 70 ? "Peluang Tinggi" : "Peluang Rendah (Risiko Tinggi)"
        },
        aiOpinion: analysisMsg,
        similarPrecedents: [
            { id: "MA/123/2023", matchRate: 94, isFavorable: true },
            { id: "MA/456/2021", matchRate: 88, isFavorable: false }
        ]
    });
});

app.post('/api/ai/chat', (req, res) => {
    const { message } = req.body;
    
    // Mocking an AI chatbot response latency
    setTimeout(() => {
        res.json({
            success: true,
            response: "Sebagai asisten hukum berbasis AI, pandangan saya merujuk pada KUHPerdata. Tindakan tersebut termasuk wanprestasi."
        });
    }, 1500);
});

// Root Health Check
app.get('/', (req, res) => {
    res.json({ 
        name: "Justice AI Platform API",
        status: "Running", 
        version: "1.0.0",
        secure: true
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`=====================================`);
    console.log(`🚀 Justice AI Backend Services API 🚀`);
    console.log(`Running on http://localhost:${PORT}`);
    console.log(`=====================================`);
});
