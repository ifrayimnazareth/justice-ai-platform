/**
 * ---------------------------------------------------------
 * JUSTICE AI - FORMATTER UTILITIES
 * Pembentukan Angka Rupiah & Parsing Nama Standar
 * ---------------------------------------------------------
 */

/**
 * Pemformat Rupiah Indonesia
 * @param {number} amount Nilai nominal
 * @returns {string} Contoh: Rp 15.000.000
 */
function toRupiah(amount) {
    if (isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Penyisipan Gelar Akademik ke Nama
 * @param {string} rawName Nama Lengkap
 * @param {string} title Gelar (e.g. "S.H., M.H.")
 * @returns {string} Contoh: Budi Santoso, S.H.
 */
function formatAdvocateName(rawName, title) {
    if (!title) return rawName;
    return `${rawName.trim()}, ${title.trim()}`;
}

/**
 * Sensor Nomor KTP (Privacy Masking)
 * @param {string} nik 16 digit NIK
 * @returns {string} 3201************
 */
function maskNIK(nik) {
    if (!nik || nik.length !== 16) return nik;
    return nik.substring(0, 4) + '*'.repeat(12);
}

/**
 * Pengecil Tulisan Khusus Pasal (Supaya kapitalisasi tepat)
 * "PASAL 112 AYAT 1" -> "Pasal 112 Ayat 1"
 */
function capitalizeLawTitle(text) {
    return text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

module.exports = {
    toRupiah,
    formatAdvocateName,
    maskNIK,
    capitalizeLawTitle
};
