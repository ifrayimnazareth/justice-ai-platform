const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBC13e1Vtr4yki4ik11pxZfUfzQ9fMUKnE";
const GEMINI_MODEL = "gemini-2.5-flash";

const AIService = {
    async callGemini(prompt, systemInstruction = "") {
        const payload = JSON.stringify({
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
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let dataChunks = [];

                res.on('data', (chunk) => {
                    dataChunks.push(chunk);
                });

                res.on('end', () => {
                    try {
                        const responseBody = Buffer.concat(dataChunks).toString();
                        const data = JSON.parse(responseBody);

                        if (res.statusCode < 200 || res.statusCode >= 300) {
                            throw new Error(data.error?.message || `HTTP Request Failed with Status: ${res.statusCode}`);
                        }

                        if (data && data.candidates && data.candidates.length > 0) {
                            resolve(data.candidates[0].content.parts[0].text);
                        } else {
                            throw new Error("Format respon API Gemini tidak terduga atau kosong.");
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            req.write(payload);
            req.end();
        });
    },

    async chat(message) {
        const instruction = "Anda adalah LexAI, asisten hukum ahli di Indonesia. Berikan informasi hukum yang akurat, profesional, dan mudah dipahami berdasarkan KUH Perdata, KUH Pidana, dan regulasi terkini di Indonesia. Gunakan nada bicara yang sopan dan berwibawa. Berikan disclaimer bahwa Anda adalah AI dan bukan pengganti saran hukum resmi.";
        return await this.callGemini(message, instruction);
    },

    async analyzeDocument(docText) {
        const instruction = "Analisis dokumen hukum berikut. Identifikasi jenis dokumen, poin-poin penting, klausul yang berisiko bagi klien, dan berikan rekomendasi perbaikan berbasis hukum Indonesia. Sajikan dalam format Markdown yang rapi dengan header dan poin-poin.";
        return await this.callGemini(docText, instruction);
    },

    async createDraft(type, context) {
        const instruction = `Buatlah draft dokumen hukum jenis: ${type}. Gunakan format formal bahasa hukum Indonesia yang baku. Pastikan mencakup klausul standar yang diperlukan untuk melindungi kepentingan klien.`;
        return await this.callGemini(context, instruction);
    }
};

module.exports = AIService;
