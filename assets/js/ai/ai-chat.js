/**
 * Justice AI - Chat AI Controller
 * File ini menangani logika UI (User Interface) untuk chatbot hukum (LexBot)
 * dan berinteraksi secara mulus dengan layanan Gemini API.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen-elemen DOM yang dibutuhkan
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const btnSend = document.querySelector('.btn-send');

    // Jika elemen-elemen yang dibutuhkan tidak ditemukan, hentikan script
    if (!chatMessages || !chatInput || !btnSend) {
        console.warn('AI Chat Controller: Elemen chat tidak ditemukan di halaman ini.');
        return;
    }

    /**
     * Memasukkan gelembung chat (bubble) baru ke dalam tampilan layar obrolan
     * @param {string} sender 'user' atau 'ai'
     * @param {string} text Teks/Isi pesan
     * @param {boolean} isHtml Apakah teks merupakan format HTML atau text biasa
     * @returns {HTMLElement} elemen bubble yang baru ditambahkan
     */
    function appendMessage(sender, text, isHtml = false) {
        const container = document.createElement('div');
        container.className = `chat-bubble-container ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        // Memberikan ikon berbeda berdasarkan siapa yang mengirim
        avatar.innerHTML = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        if (isHtml) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }

        container.appendChild(avatar);
        container.appendChild(bubble);
        chatMessages.appendChild(container);

        // Auto scroll ke paling bawah layar setiap ada pesan baru
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return container;
    }

    /**
     * Fungsi utama untuk mengirim pesan dan menerima jawaban dari AI
     */
    async function sendMessage() {
        // Ambil nilai inputan teks
        const message = chatInput.value.trim();
        if (!message) return; // Abaikan jika input kosong

        // 1. Tampilkan pesan user ke layar
        appendMessage('user', message);

        // 2. Kosongkan kotak input
        chatInput.value = '';

        // 3. Tampilkan indikator loading AI sedang memproses
        const loadingHtml = `<div style="display:flex; gap:8px; align-items:center;">
                                <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 0.9rem;"></i> 
                                LexBot Sedang Menganalisis Hukum...
                             </div>`;
        const loadingNode = appendMessage('ai', loadingHtml, true);

        try {
            // Pastikan GeminiService telah dipanggil/dimuat di file HTML sebelumnya
            if (typeof GeminiService === 'undefined') {
                throw new Error("Sistem AI/GeminiService belum ter-load (pastikan gemini-api.js disertakan di HTML).");
            }

            // 4. Request jawaban dari Google Gemini lewat GeminiService
            const reply = await GeminiService.chat(message);

            // 5. Konversi format markdown ke format HTML (Agar tebal/miring terlihat rapi)
            let formattedReply = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Format text Bold
            formattedReply = formattedReply.replace(/\*(.*?)\*/g, '<em>$1</em>');       // Format text Italic
            formattedReply = formattedReply.replace(/\n\n/g, '<br><br>');                // Format 2 baris baru
            formattedReply = formattedReply.replace(/\n/g, '<br>');                      // Format baris baru

            // Highlight format List bernomor - (Deteksi angka dengan titik)
            formattedReply = formattedReply.replace(/(\d+\.)\s/g, '<br><strong>$1</strong> ');

            // Highlight pasal kalau ada
            formattedReply = formattedReply.replace(/(Pasal [0-9]+)/gi, '<span style="color: #38bdf8; font-weight: bold;">$1</span>');

            // 6. Hapus indikator loading, Tampilkan jawaban asli dari AI
            chatMessages.removeChild(loadingNode);
            appendMessage('ai', formattedReply, true);

        } catch (error) {
            // Jika pencarian mengalami kegagalan / Error (Misal error jaringan/kuota limit)
            chatMessages.removeChild(loadingNode);
            const errorHtml = `<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Terjadi Kesalahan: ${error.message}</span>
                               <br><small style="color: #cbd5e1;">Pastikan koneksi internet aktif dan API Key valid.</small>`;
            appendMessage('ai', errorHtml, true);
        }
    }

    // Sambungkan fingsionalitas ke Tombol Kirim
    btnSend.addEventListener('click', sendMessage);

    // Sambungkan fungsi ke keyboard Enter di Kotak ketik
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Mencegah enter membuat baris baru default
            sendMessage();
        }
    });

    // --- Fitur Sesi Chat Baru ---
    const btnNewChatSession = document.getElementById('btnNewChatSession');
    if (btnNewChatSession) {
        btnNewChatSession.addEventListener('click', () => {
            chatMessages.innerHTML = ''; // Hapus percakapan sebelumnya
            const welcomeHtml = `Halo! Saya LexBot, asisten hukum AI terlatih dengan ribuan putusan Mahkamah Agung & KUHPerdata. Silakan ceritakan kronologi masalah hukum yang Anda hadapi pada sesi chat baru ini.`;
            appendMessage('ai', welcomeHtml, true);
        });
    }

    // --- Fitur Upload Dokumen ---
    const btnUploadFile = document.getElementById('btnUploadFile');
    const hiddenFileInput = document.getElementById('hiddenFileInput');
    if (btnUploadFile && hiddenFileInput) {
        btnUploadFile.addEventListener('click', () => {
            hiddenFileInput.click();
        });

        hiddenFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                appendMessage('user', `Lampiran File: <strong>${file.name}</strong>`, true);
                
                // Animasi Loading
                const loadingHtml = `<div style="display:flex; gap:8px; align-items:center;">
                                        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 0.9rem;"></i> 
                                        LexBot sedang mengunggah dan membaca dokumen ${file.name}...
                                     </div>`;
                const loadingNode = appendMessage('ai', loadingHtml, true);

                // Simulasi pembacaan dokumen
                setTimeout(() => {
                    chatMessages.removeChild(loadingNode);
                    appendMessage('ai', `File <strong>${file.name}</strong> berhasil diunggah.<br><br>Apa yang ingin Anda tanyakan atau analisis terkait dengan file ini?`, true);
                }, 1500);
            }
        });
    }

    // --- Fitur Input Suara (Microphone) ---
    const btnMicInput = document.getElementById('btnMicInput');
    if (btnMicInput) {
        let recognizing = false;
        let recognition;
        
        // Cek dukungan Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.lang = 'id-ID'; // Bahasa Indonesia
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                recognizing = true;
                btnMicInput.style.color = '#ef4444'; // Ubah tombol jadi merah saat merekam
                chatInput.placeholder = "Mendengarkan suara Anda...";
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                chatInput.value = transcript;
                sendMessage(); // Otomatis kirim pesan
            };
            
            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                btnMicInput.style.color = '';
                chatInput.placeholder = "Kirim kronologi atau tanya pasal hukum...";
                recognizing = false;
            };
            
            recognition.onend = () => {
                btnMicInput.style.color = '';
                chatInput.placeholder = "Kirim kronologi atau tanya pasal hukum...";
                recognizing = false;
            };
        } else {
            console.warn("Speech Recognition API tidak didukung browser ini.");
        }

        btnMicInput.addEventListener('click', () => {
            if (window.location.protocol === 'file:') {
                alert("Peringatan: Fitur Mikrofon (Voice Input) diblokir oleh browser saat membuka file langsung (file:///...). Silakan jalankan menggunakan Web Server lokal (XAMPP / Node.js / Live Server) agar fitur suara dapat berfungsi.");
                return;
            }
            if (!recognition) {
                alert('Maaf, Fitur input suara tidak didukung di browser Anda.');
                return;
            }
            if (recognizing) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    }

    // Ekspos fungsi appendMessage agar bisa ditebak dari global scope (opsional)
    window.LexBotUI = {
        appendMessage: appendMessage
    };
});
