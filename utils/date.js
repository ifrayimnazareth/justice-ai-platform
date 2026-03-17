/**
 * ---------------------------------------------------------
 * JUSTICE AI - DATE & TIME UTILITIES
 * Konversi Standar & Kompatibilitas Waktu Mahkamah
 * ---------------------------------------------------------
 */

/**
 * Mendapatkan Tanggal String Format Khusus Pengadilan
 * @param {Date|string} dateObj Tanggal (Bisa String ISO atau Date API)
 * @returns {string} Contoh: "12 Januari 2026"
 */
function toCourtDate(dateObj) {
    if (!dateObj) return '-';
    const date = new Date(dateObj);
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Mendapatkan Waktu Menit:Detik dari Objek Transkript Audio
 * @param {number} totalSeconds Total Detik 
 * @returns {string} Contoh: "05:12"
 */
function formatAudioTime(totalSeconds) {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/**
 * Rentang Waktu Jatuh Tempo Kalender (30 Hari)
 * e.g., Batas waktu Pembayaran E-Court
 * @param {number} days Menuju jatuh tempo / tenggat waktu
 * @returns {Date} Object Tanggal Masa Depan
 */
function getDeadlineDate(days = 3) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today;
}

/**
 * Mendeteksi Apakah Masa Berlaku Sesuatu Telah Habis
 * @param {Date|string} expiryDate 
 * @returns {boolean} True jika kedaluwarsa, False sebaliknya
 */
function isExpired(expiryDate) {
    if (!expiryDate) return false;
    const now = new Date();
    const expiry = new Date(expiryDate);
    return now > expiry;
}

module.exports = {
    toCourtDate,
    formatAudioTime,
    getDeadlineDate,
    isExpired
};
