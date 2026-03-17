const crypto = require('crypto');

// ---------------------------------------------------------
// JUSTICE AI - DIGITAL FINGERPRINT FOR LEGAL DOCUMENTS
// Alat pelacakan otentikasi dokumen PDF (Anti-Pemalsuan)
// ---------------------------------------------------------

/**
 * Membuat "Sidik Jari" unik dari File Kontrak menggunakan algoritma SHA-256
 * @param {Buffer} fileBuffer - File dokumen mentah (PDF/Word)
 * @returns {string} Hash signature Heksadesimal
 */
function generateDocumentFingerprint(fileBuffer) {
    if (!Buffer.isBuffer(fileBuffer)) {
        throw new TypeError("Data bukan objek Buffer yang valid.");
    }

    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    
    return hash.digest('hex'); // Menghasilkan rantai string 64-karakter
}

/**
 * Validasi apakah dua dokumen PDF 100% identik (tidak ada spasi/titik yang diubah)
 * @param {Buffer} currentDocumentBuffer - Dokumen yang sedang diunggah
 * @param {string} originalHash - Hash sidik jari asli yang tersimpan di Database
 * @returns {boolean} True jika asli, False jika dokumen diedit (Forgery Detection)
 */
function verifyDocumentAuthenticity(currentDocumentBuffer, originalHash) {
    const currentHash = generateDocumentFingerprint(currentDocumentBuffer);
    console.log(`[Hash Matcher] Orig: ${originalHash} | Curr: ${currentHash}`);
    
    return currentHash === originalHash;
}

module.exports = {
    generateDocumentFingerprint,
    verifyDocumentAuthenticity
};
