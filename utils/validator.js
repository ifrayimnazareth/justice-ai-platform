/**
 * ---------------------------------------------------------
 * JUSTICE AI - BACKEND VALIDATOR SERVICE
 * Filter dan Sanitasi input dari pengguna untuk mencegah SQLi/XSS
 * ---------------------------------------------------------
 */

// Format Nomor Telepon Indonesia (Mulai 08 atau +62)
function isValidNIK(nik) {
    const nikRegex = /^(1[1-9]|2[1\n-9]|3[1-6]|5[1-3]|6[1-5]|7[1-6]|8[1-2]|9[1-2])[0-9]{2}[0-9]{2}(0[1-9]|1[0-2])[0-9]{2}[0-9]{4}$/;
    return nikRegex.test(nik) && String(nik).length === 16;
}

// Regex Validasi Email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validasi Kata Sandi (Minimal 8 Karakter, 1 Huruf Besar, 1 Angka, 1 Simbol Khusus)
function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
}

// Mencegah Cross-Site Scripting (XSS) pada String Bebas (e.g. Chat Hukum)
function sanitizeText(inputStr) {
    if (!inputStr) return "";
    return inputStr
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

module.exports = {
    isValidNIK,
    isValidEmail,
    isStrongPassword,
    sanitizeText
};
