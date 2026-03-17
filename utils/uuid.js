/**
 * ---------------------------------------------------------
 * JUSTICE AI - UUID GENERATOR
 * Pembuatan ID Unik Tersandi (Cryptographically Secure)
 * ---------------------------------------------------------
 */

const crypto = require('crypto');

/**
 * Pembangkit String Acak (Bukan UUID resmi, tapi cukup untuk mock/prototype)
 * Cocok untuk ID Transaksi, ID Kasus, dll.
 * @param {number} length Panjang karakter yang diinginkan
 * @param {string} prefix Awalan (opsional) misal 'TRX-'
 * @returns {string} String ID Unik
 */
function generateRandomId(length = 16, prefix = '') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % chars.length];
    }
    return prefix ? `${prefix}${result}` : result;
}

/**
 * Pembangkit UUID v4 (Sesuai Standar RFC 4122)
 * Digunakan untuk Database Relasional (Primary Key)
 * @returns {string} UUID (contoh: 123e4567-e89b-12d3-a456-426614174000)
 */
function generateUUIDv4() {
    return crypto.randomUUID();
}

/**
 * Membrane khusus ID khusus entitas platform
 */
const IDFactory = {
    createUserId: () => generateRandomId(8, 'USR-'),
    createClientId: () => generateRandomId(8, 'CLI-'),
    createLawyerId: () => generateRandomId(8, 'LWY-'),
    createCaseId: () => generateRandomId(10, 'CASE-'),
    createTransactionId: () => generateRandomId(12, 'PAY-'),
    createVaultId: () => generateRandomId(16, 'VLT-')
};

module.exports = {
    generateRandomId,
    generateUUIDv4,
    IDFactory
};
