/**
 * Justice AI - Gemini API Service Integration (Client-Side)
 * This service handles communication directly with Google Gemini Pro model from the browser.
 */

// Gunakan kunci API Anda di bawah ini
const GEMINI_API_KEY = "AIzaSyBC13e1Vtr4yki4ik11pxZfUfzQ9fMUKnE";
const GEMINI_MODEL = "gemini-2.5-flash"; // Menggunakan model terbaru gemini-2.5-flash yang didukung API

async function callGemini(prompt, systemInstruction = "") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: systemInstruction + "\n\nUser Question: " + prompt }]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Gagal merespon dari API Google Gemini');
        }

        const data = await response.json();
        
        // Memastikan format Google Gemini JSON ter-handle dengan tepat
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.promptFeedback && data.promptFeedback.blockReason) {
             throw new Error("Pesan ditolak oleh sistem AI karena: " + data.promptFeedback.blockReason);
        } else {
             throw new Error("Sistem AI gagal memberikan respon konten.");
        }
        
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

// Specialized functions for legal tasks
const GeminiService = {
    // General chat
    async chat(message) {
        const instruction = "Anda adalah LexAI, asisten hukum ahli di Indonesia. Berikan informasi hukum yang akurat, profesional, dan mudah dipahami berdasarkan KUH Perdata, KUH Pidana, dan regulasi terkini di Indonesia. Gunakan nada bicara yang sopan dan berwibawa. Berikan disclaimer bahwa Anda adalah AI dan bukan pengganti saran hukum resmi.";
        return await callGemini(message, instruction);
    },

    // Document analysis
    async analyzeDocument(docText) {
        const instruction = "Analisis dokumen hukum berikut. Identifikasi jenis dokumen, poin-poin penting, klausul yang berisiko bagi klien, dan berikan rekomendasi perbaikan berbasis hukum Indonesia. Sajikan dalam format Markdown yang rapi dengan header dan poin-poin.";
        return await callGemini(docText, instruction);
    },

    // Legal drafting
    async createDraft(type, context) {
        const instruction = `Buatlah draft dokumen hukum jenis: ${type}. Gunakan format formal bahasa hukum Indonesia yang baku. Pastikan mencakup klausul standar yang diperlukan untuk melindungi kepentingan klien.`;
        return await callGemini(context, instruction);
    }
};

window.GeminiService = GeminiService;
