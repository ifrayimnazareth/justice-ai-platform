require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Dummy Database (Mocking MongoDB for prototyping)
const MOCK_DB = {
    users: [],
    lawyers: [],
    cases: []
};

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet()); // Set precise HTTP Headers for security
app.use(cors({
    origin: '*', // For prototyping. In prod: restrict to frontend domains
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting against Bruteforce
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: { error: 'Terlalu banyak request dari IP ini, coba lagi dalam 15 menit.' }
});
app.use('/api/', apiLimiter);

// Express Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev')); // Log API HTTP Requests

// ==========================================
// 🚀 API ROUTES / ENDPOINTS
// ==========================================

// Hubungkan Rute AI Server ke endpoint /api/ai
const aiRoutes = require('./api/routes/ai-routes');
app.use('/api/ai', aiRoutes);

// 1. Root API Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'Online',
        ai_engine: 'LexBot v2.1',
        vault_encryption: 'AES-256-GCM',
        server_time: new Date().toISOString()
    });
});

// 2. Authentication Mock
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Hardcoded logic for presentation
    if(email === 'budi.santoso@gmail.com' && password === 'admin123') {
        return res.json({
            token: "JWT-MOCK-TOKEN-XYZ-789",
            user: { role: 'client', name: 'Budi Santoso', vaultId: 'VLT-912' }
        });
    }

    if(email === 'farhan.law@email.com' && password === 'lawyer123') {
        return res.json({
            token: "JWT-MOCK-TOKEN-LWY-111",
            user: { role: 'lawyer', name: 'Farhan Dirgantara', nia: '2011.092.41' }
        });
    }
    
    return res.status(401).json({ error: 'Kredensial tidak valid atau akun dibekukan.' });
});

// 3. AI Contract Review (Mock Scanner)
app.post('/api/ai/contract-scan', (req, res) => {
    // In production, `req.file` would contain the PDF buffered to memory
    // and passed into an OCR + LLM engine like OpenAI / Anthropic API
    
    res.json({
        status: 'scanned',
        score: 68,
        risk_level: 'TINGGI',
        findings: [
            {
                type: 'CRITICAL',
                clause: 'Pelepasan Hak Gugat Hukum',
                description: 'Klausul menetapkan Anda tidak bisa menuntut kerugian di pengadilan.',
                law_reference: 'Pasal 1337 KUHPerdata'
            },
            {
                type: 'WARNING',
                clause: 'Bunga Denda Mencekik',
                description: 'Denda 5% per hari menyerupai praktik lintah darat.',
                law_reference: 'Yurisprudensi MA Niaga'
            }
        ]
    });
});

// 4. Secure Vault Upload
app.post('/api/vault/upload', (req, res) => {
    // Simulate Encrypting a file with AES-256
    res.json({
        message: 'File berhasil dienkripsi dan diamankan.',
        hash: 'A39F9B2C300F...91XX1',
        size_kb: 450
    });
});

// 5. Video Call Signaling Endpoint (Mock)
app.get('/api/consultation/token', (req, res) => {
    res.json({
        room_id: "LITIGASI-ROOM-X912",
        secure_token: "WEBRTC-E2EE-TOKEN",
        ai_transcription: "enabled"
    });
});

// Start the Backend Node Server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🛡️  JUSTICE AI BACKEND SERVER ONLINE `);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🧠 AI Engine: Ready`);
    console.log(`=========================================`);
    console.log(`To start full integration: npm run dev`);
});
