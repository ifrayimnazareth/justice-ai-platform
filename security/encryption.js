const crypto = require('crypto');
require('dotenv').config();

// ---------------------------------------------------------
// JUSTICE AI - CORE ENCRYPTION SERVICE
// Mengamankan data sensitif dengan standar militer AES-256-GCM
// ---------------------------------------------------------

const ALGORITHM = 'aes-256-gcm';
// Di lingkungan produksi, MASTER_KEY harus disimpan di AWS KMS atau Azure Key Vault
// Untuk keperluan purwarupa, kita menggunakan fallback key sementara
const MASTER_KEY = process.env.VAULT_MASTER_KEY || crypto.randomBytes(32).toString('hex'); 

/**
 * Mengenkripsi teks biasa atau buffer dokumen ke dalam bentuk Cipher
 * @param {string|Buffer} text - Data mentah yang akan diamankan
 * @returns {object} Objek berisi IV, AuthTag (untuk validasi integritas), dan Ciphertext
 */
function encryptData(text) {
    const iv = crypto.randomBytes(16); // Initialization Vector unik
    const key = Buffer.from(MASTER_KEY, 'hex');

    // Menggunakan GCM (Galois/Counter Mode) yang lebih efisien dan aman dari CBC
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag(); // Mencegah tampering data

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag.toString('hex')
    };
}

/**
 * Mendekripsi Ciphertext kembali ke bentuk data mentah (hanya bisa dengan kunci yang sama)
 * @param {object} encryptedMap - Objek hasil encrypData()
 * @returns {string} String asli
 */
function decryptData(encryptedMap) {
    try {
        const iv = Buffer.from(encryptedMap.iv, 'hex');
        const authTag = Buffer.from(encryptedMap.authTag, 'hex');
        const key = Buffer.from(MASTER_KEY, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedMap.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error("🔒 DECRYPTION FAILED. Indikasi Modifikasi Data / Tampering: ", error.message);
        throw new Error("Akses Brankas Ditolak: Kunci tidak valid atau file korup.");
    }
}

/**
 * Hashing satu arah (Irreversible) untuk Kata Sandi Pengguna
 */
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

module.exports = {
    encryptData,
    decryptData,
    hashPassword
};
