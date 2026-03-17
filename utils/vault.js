const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { encryptData, decryptData } = require('../security/encryption');

// ---------------------------------------------------------
// JUSTICE AI - DIGITAL VAULT MANAGER
// Mengatur penyimpanan fisik (Storage) file terenkripsi klien
// ---------------------------------------------------------

const VAULT_STORAGE_PATH = path.join(__dirname, '..', 'storage', 'vault');

/**
 * Menyimpan dokumen mentah (KTP/Kontrak) menjadi file Crypto-Chunk
 * @param {string} userId - ID Pemilik Brankas
 * @param {string} fileName - Nama asli file (cth: sertifikat-tanah.pdf)
 * @param {Buffer} fileBuffer - Isi mentah dari file upload
 * @returns {object} Metadata yang akan disimpan ke MongoDB (lokasi file AES)
 */
function lockDocument(userId, fileName, fileBuffer) {
    if (!fs.existsSync(VAULT_STORAGE_PATH)) {
        fs.mkdirSync(VAULT_STORAGE_PATH, { recursive: true });
    }

    // Hash nama file agar tidak mudah ditebak dari Folder OS
    const safeFileName = crypto.createHash('sha256').update(fileName + Date.now()).digest('hex');
    const secureFilePath = path.join(VAULT_STORAGE_PATH, `${userId}_${safeFileName}.enc`);

    // Proses Enkripsi
    const cipherObject = encryptData(fileBuffer.toString('base64')); // Untuk simplifikasi, jadikan base64 string
    
    // Simpan objek Cipher (beserta IV dan Tag) ke dalam Disk Storage
    fs.writeFileSync(secureFilePath, JSON.stringify(cipherObject), 'utf8');

    return {
        originalName: fileName,
        vaultReferenceId: `${userId}_${safeFileName}.enc`,
        sizeBytes: fileBuffer.byteLength,
        encryptedAt: new Date().toISOString()
    };
}

/**
 * Mengambil (Fetch) dan Mendekripsi dokumen dari Brankas
 * @param {string} vaultReferenceId - ID unik dari MongoDB
 * @returns {string} Base64 string dari file asli, siap ditransfer ke Browser (Blob URL)
 */
function unlockDocument(vaultReferenceId) {
    const targetPath = path.join(VAULT_STORAGE_PATH, vaultReferenceId);
    
    if (!fs.existsSync(targetPath)) {
        throw new Error("❌ File Brankas Hilang atau Terhapus dari Server Utama.");
    }

    const fileContent = fs.readFileSync(targetPath, 'utf8');
    const encryptedObject = JSON.parse(fileContent);

    // Proses Dekripsi
    const decryptedBase64Info = decryptData(encryptedObject);
    return decryptedBase64Info; 
}

module.exports = {
    lockDocument,
    unlockDocument
};
