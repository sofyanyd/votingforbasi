import { Link } from "react-router-dom";

export default function Deskripsi() {
    // ── DATA FAQ UNTUK VOTING ──
    const faqItems = [
        { title: "Apa itu Voting LKBB Alfabet 5?", description: "Ini adalah platform pemungutan suara resmi untuk menentukan juara favorit pada ajang Lomba Keterampilan Baris Berbaris (LKBB) Alfabet ke-5 Tahun 2026." },
        { title: "Bagaimana cara melakukan voting?", description: "Kamu bisa pergi ke tab 'Finalis', pilih pleton jagoanmu, lalu klik tombol 'Vote'. Pastikan kamu sudah memiliki tiket/kuota vote yang valid." },
        { title: "Apakah satu akun bisa vote berkali-kali?", description: "Sistem voting diatur sesuai dengan kebijakan panitia. Biasanya, satu tiket/kuota berlaku untuk satu kali vote." },
        { title: "Kapan periode voting ditutup?", description: "Voting akan ditutup secara otomatis pada hari puncak pelaksanaan LKBB Alfabet 5. Pastikan kamu memberikan dukungan sebelum waktu habis!" },
        { title: "Bagaimana cara melihat siapa yang memimpin?", description: "Kamu bisa memantau perolehan suara sementara secara real-time melalui menu 'Leaderboard' di bagian atas halaman." },
    ];

    // ── DATA TATA CARA VOTING (Menggantikan Event Sections) ──
    const votingSteps = [
        {
            title: "1. Temukan Finalis Favoritmu",
            desc: `Jelajahi daftar seluruh peserta LKBB Alfabet 5 di halaman Finalis. Lihat profil, asal sekolah/instansi, dan nomor urut mereka untuk memastikan kamu tidak salah pilih.`,
            btnLabel: "LIHAT FINALIS",
            link: "/voting/finalis",
            bg: "white",
        },
        {
            title: "2. Dapatkan Tiket / Kuota Vote",
            desc: `Untuk menjaga sportivitas dan validitas, setiap dukungan memerlukan tiket vote resmi. Kamu bisa mendapatkan tiket ini melalui panitia atau sistem registrasi KreenConnect.`,
            btnLabel: "INFO TIKET",
            link: "/voting/dukungan",
            bg: "blue",
        },
        {
            title: "3. Berikan Dukunganmu!",
            desc: `Setelah menentukan pilihan, klik tombol VOTE pada kartu peserta jagoanmu. Suaramu akan langsung masuk dan mengubah peringkat mereka di Leaderboard secara real-time!`,
            btnLabel: "CEK LEADERBOARD",
            link: "/voting/leaderboard",
            bg: "white",
        },
    ];

    return (
        <div className="bg-white font-sans rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* ── 1. HERO SECTION ── */}
            <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16">
                <div className="max-w-lg">
                    <p className="text-blue-600 font-bold tracking-wider text-sm mb-2 uppercase">
                        Platform Voting Resmi
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 leading-tight">
                        Dukung Pleton Favoritmu di <span className="text-blue-600">KEJURCAB</span>
                    </h1>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        Mari sukseskan Lomba Keterampilan Baris Berbaris (LKBB) Alfabet ke-5 Tahun 2026. 
                        Satu suaramu sangat berharga untuk menentukan siapa yang berhak membawa pulang piala Juara Favorit!
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link 
                            to="/voting/dukungan" 
                            className="bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
                        >
                            VOTE SEKARANG
                        </Link>
                        <Link 
                            to="/voting/leaderboard"
                            className="border-2 border-blue-600 text-blue-600 text-sm font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                            CEK LEADERBOARD
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}