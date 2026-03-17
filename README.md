# THE JUSTICE AI PLATFORM ⚖️ 🤖

Sistem Integrasi Peradilan Pintar Berbasis Kecerdasan Buatan & WebRTC untuk menengahi sengketa secara Daring, menghubungkan Klien, Advokat, Hakím (*E-Court* Mahkamah Agung), di dalam satu ekosistem berbasis *End-to-End Encryption* (*Zero Retention Policy*).

---

## 🚀 Fitur Utama

- **LexBrain (AI LLM):** Mesin analisa draf hukum, prediksi peluang menang (*Win-Rate Probability*), peringatan red-flag pasal kontrak, dan Auto-Drafting Pledoi untuk *Lawyers* dan *Hakim*.
- **Brankas Dokumen AES-256 (Vault):** Sistem unggah bukti forensik digital KTP, kontrak, atau chat WhatsApp. Hanya kunci Dekripsi (Passphrase) di tangan Anda yang bisa membuka file-file tersebut. 
- **WebRTC Secure Teleconference:** Konsultasi Video antara Klien <-> Pengacara <-> Hakim yang dibungkus oleh *End-to-End Encryption*. Admin maupun peretas tidak dapat mengendus apa yang sedang Anda katakan.
- **Xendit Escrow API:** Penahanan otomatis retensi uang dari Klien ke dalam rekening bersama (*escrow*) platform hinggal *work-completed* untuk menjaga keamanan finansial (Anti-Pengacara Bodong).
- **KYC & API Gateway (Dukcapil/Peruri):** Integritas tinggi dengan e-Meterai otomatis dan liveness detection Dukcapil untuk memverifikasi advokat PERADI palsu.
- **Multi-Level Dashboard:** 4 Antarmuka dengan Tema Gelap Premium khusus (Role-Based Access Control).
  - `/dashboards/client` - Akses warga / korporasi (*Booking Lawyer*, Saldo, Vault)
  - `/dashboards/lawyer` - Studio Advokat (Manajemen Klien, Kalkulator *Fee*, Teleconference)
  - `/dashboards/judge` - Singgasana E-Court (Putusan Sidang, Identifikasi Argumen Lawan, Sync WSS)
  - `/dashboards/admin` - (*Root Super Admin Level 5*) Manajemen Gateway API, Firewall, Pajak (Faktur) & Analitik Eksekutif.

---

## 📂 Struktur Repositori Inti

Platform masif ini dirangkai di atas Node.js Microservices dan Nginx Web Proxy. 340+ dokumen sudah disebarkan dengan pola *Clean Directory Layout*:

```bash
Justice-AI-Platform
│
├── 📁 public/       # Halaman Landing (Frontend Vue / Vanilla)
├── 📁 auth/         # Gateway Login, 2FA, Lupa Password, OTP
├── 📁 dashboards/   # Level Autentikasi RBAC (Admin/Lawyer/Client/Judge)
├── 📁 ai/           # Engine Chatbot, Legal Drafting, & Bukti Validator
├── 📁 api/          # Middlewares, Express Routes & Controllers (Backend)
├── 📁 assets/       # CSS Themes (Dark), JS Core
├── 📁 docker/       # Konfigurasi Kubernetes & Container (*Dev*/*Prod*)
├── 📁 config/       # Secret Keys (.env parser), Database Conns
└── 📄 server.js     # Entrypoint Layanan Utama (Express.js)
```

---

## 🛠 Instalasi & Menjalankan Infrastruktur Lokal (Docker)

Sistem sudah mendukung pembungkusan *container* (MongoDB, Redis, Node.js API, Nginx). Pastikan komputer Anda telah menjalankan daemon Docker Engine.

**1. Salin Konfigurasi Environment**
Dapatkan kredensial *OpenAI API Key*, *Xendit API Key*, dan ganti kata sandi rahasia Enkriptor.
```bash
cp .env.example .env
```

**2. Jalankan Cluster Platform (Dev Build)**
Gunakan `docker-compose` yang disediakan pada folder konfigurasi:
```bash
docker-compose -f docker/docker-compose.yml up --build -d
```
Sistem ini akan mempersiapkan 4 kontainer yang saling berbicara.
- `justice-frontend` di Web Browser `http://localhost:80`
- `justice-backend` di Node Server `http://localhost:5000`
- `justice-mongodb` (Database JSON Store)
- `justice-redis` (Cache & Session Store WebRTC)

---

## ⚖️ Penafian Hukum & Keamanan (Disclaimer)

Sistem perangkat keras (WAF/Cloud) yang di-deploy nanti harus mematuhi **UU PDP Republik Indonesia (Undang-Undang Pelindungan Data Pribadi)**. Jangan pernah menggunakan *Cipher Block Chaining* (CBC) lama, tetap gunakan `AES-256-GCM` yang sudah diset di modul Enkripsi JavaScript. 

Segala aktivitas log peretas (Brute-Force, SQL Injection) otomatis direkam dan dipotong di level API (*gateway config*).
