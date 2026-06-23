export const requireAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Akses ditolak: Token tidak ditemukan" });
        }
        const token = authHeader.split(" ")[1];
        // Validate token structure: admin-token-<userId>-<timestamp>
        if (!token.startsWith("admin-token-")) {
            return res.status(403).json({ message: "Akses ditolak: Token tidak valid" });
        }
        const parts = token.split("-");
        const userId = Number(parts[2]);
        const timestamp = Number(parts[3]);
        // Expiration check: 7 days
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if (isNaN(timestamp) || Date.now() - timestamp > sevenDaysMs) {
            return res.status(401).json({ message: "Sesi Anda telah berakhir, silakan login kembali" });
        }
        req.userId = userId;
        req.userRole = "admin";
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Kesalahan validasi token keamanan", error });
    }
};
