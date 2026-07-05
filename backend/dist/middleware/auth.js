import crypto from "crypto";
export const requireAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Akses ditolak: Token tidak ditemukan" });
        }
        const token = authHeader.split(" ")[1];
        // Validate token structure: admin-token-<userId>-<timestamp>-<signature>
        if (!token.startsWith("admin-token-")) {
            return res.status(403).json({ message: "Akses ditolak: Token tidak valid" });
        }
        const parts = token.split("-");
        if (parts.length < 5) {
            return res.status(403).json({ message: "Akses ditolak: Struktur token tidak valid" });
        }
        const userId = Number(parts[2]);
        const timestamp = Number(parts[3]);
        const signature = parts[4];
        // Expiration check: 7 days
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if (isNaN(timestamp) || Date.now() - timestamp > sevenDaysMs) {
            return res.status(401).json({ message: "Sesi Anda telah berakhir, silakan login kembali" });
        }
        // Cryptographic signature verification
        const secret = process.env.JWT_SECRET || "default_fallback_secret_key_123_forbasi";
        const expectedSignature = crypto.createHmac("sha256", secret).update(`${userId}-${timestamp}`).digest("hex");
        if (signature !== expectedSignature) {
            return res.status(403).json({ message: "Akses ditolak: Tanda tangan token tidak sah" });
        }
        req.userId = userId;
        req.userRole = "admin";
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Kesalahan validasi token keamanan", error });
    }
};
