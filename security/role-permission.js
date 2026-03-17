/**
 * ---------------------------------------------------------
 * JUSTICE AI - RBAC (Role-Based Access Control)
 * Mengamankan fungsi berdasarkan jabatan (Klien, Lawyer, Admin)
 * ---------------------------------------------------------
 */

const ROLES = {
    ROOT_ADMIN: 'A',
    LAWYER: 'L',
    CLIENT: 'C',
    JUDGE: 'J' // Rencana Eksekusi E-Litigation Tahap 2
};

const permissionsInfo = {
    'create:case': [ROLES.CLIENT],
    'read:case:own': [ROLES.CLIENT, ROLES.LAWYER],
    'update:case:status': [ROLES.LAWYER, ROLES.ROOT_ADMIN],
    'delete:case': [ROLES.ROOT_ADMIN], // Only Admin via GDPR wipe
    
    'upload:vault': [ROLES.CLIENT, ROLES.LAWYER],
    'read:vault:own': [ROLES.CLIENT],
    'read:vault:shared': [ROLES.LAWYER],
    
    'ban:user': [ROLES.ROOT_ADMIN],
    'approve:kyc': [ROLES.ROOT_ADMIN]
};

/**
 * Middleware Otorisasi Hak Akses (untuk Express JS)
 * @param {string} requiredPermission Contoh: 'upload:vault'
 */
function checkPermission(requiredPermission) {
    return (req, res, next) => {
        // Asumsi data user di-decode dari JWT dan disimpan di req.user
        const userRole = req.user?.role;
        
        if (!userRole) {
            return res.status(401).json({ error: "Token Otentikasi Hilang atau Kadaluarsa" });
        }

        const allowedRoles = permissionsInfo[requiredPermission] || [];

        if (allowedRoles.includes(userRole) || userRole === ROLES.ROOT_ADMIN) {
            // Super Admin bisa bypass semua, atau User punya role yang pas
            next();
        } else {
            return res.status(403).json({ error: "🚫 403 FORBIDDEN: Anda tidak memiliki akses ke fungsi ini." });
        }
    };
}

module.exports = {
    ROLES,
    checkPermission
};
