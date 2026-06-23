import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button"; 
import { Collapse } from "../components/ui/Collapse";
import { Award, Vote, TrendingUp } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate(); 

    const faqItems = [
        { title: "Apa itu Voting KEJURCAB?", description: "Ini adalah platform pemungutan suara resmi untuk menentukan juara favorit pada ajang Lomba Keterampilan Baris Berbaris (LKBB) Tingkat Cabang (KEJURCAB) Tahun 2026." },
        { title: "Bagaimana cara melakukan voting?", description: "Kamu bisa pergi ke tab 'Dukungan' lalu 'BELI TIKET VOTE', pilih pleton jagoanmu, lalu klik tombol 'Vote'. Pastikan kamu sudah memiliki tiket/kuota vote yang valid." },
        { title: "Apakah satu akun bisa vote berkali-kali?", description: "Sistem voting diatur sesuai dengan kebijakan panitia." },
        { title: "Kapan periode voting ditutup?", description: "Voting akan ditutup secara otomatis pada hari puncak pelaksanaan. Pastikan kamu memberikan dukungan sebelum waktu habis!" },
        { title: "Bagaimana cara melihat siapa yang memimpin?", description: "Kamu bisa memantau perolehan suara sementara secara real-time melalui menu 'Leaderboard' di bagian atas halaman." },
    ];

    const votingSteps = [
        {
            title: "Temukan Peserta Favoritmu",
            desc: `Jelajahi daftar seluruh peserta LKBB di halaman Peserta. Lihat profil, asal sekolah, dan nomor urut mereka untuk memastikan kamu tidak salah pilih.`,
            btnLabel: "LIHAT PESERTA",
            link: "/peserta",
            bg: "white",
            icon: Award
        },
        {
            title: "Dapatkan Tiket Vote",
            desc: `Untuk menjaga sportivitas, setiap dukungan memerlukan tiket resmi. Kamu bisa mendapatkan tiket ini melalui sistem registrasi kami.`,
            btnLabel: "INFO TIKET",
            link: "/dukungan",
            bg: "emerald", 
            icon: Vote
        },
        {
            title: "Berikan Dukunganmu!",
            desc: `Setelah menentukan pilihan, klik tombol VOTE. Suaramu akan langsung masuk dan mengubah peringkat mereka di Leaderboard secara real-time!`,
            btnLabel: "CEK LEADERBOARD",
            link: "/leaderboard",
            bg: "white",
            icon: TrendingUp
        },
    ];

    return (
        <div className="bg-gray-50 font-sans min-h-screen pb-20">
            
            {/* Konfigurasi Custom Animation untuk efek Shine */}
            <style>
                {`
                @keyframes shine {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .animate-shine {
                    background-size: 200% auto;
                    animation: shine 3s linear infinite;
                }
                `}
            </style>

            <section className="bg-white border-b border-gray-100 rounded-b-[40px] shadow-sm overflow-hidden min-h-[500px] lg:h-screen lg:max-h-[700px] flex items-center relative z-10 py-12 lg:py-0">
                <div className="w-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 max-w-7xl mx-auto gap-8">
                    
                    <div className="max-w-xl w-full text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                            Platform Voting Resmi
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                            Dukung Pleton Favoritmu di <br className="hidden lg:block"/>
                            {/* EFEK SHINE DI SINI */}
                            <span className="animate-shine bg-gradient-to-r from-emerald-600 via-emerald-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
                                KEJURCAB
                            </span>
                        </h1>
                        
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                            Mari sukseskan LKBB Tahun 2026. Satu suaramu sangat berharga untuk menentukan siapa yang berhak membawa pulang piala Juara Favorit!
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                            <Button 
                                variant="primary" 
                                className="w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap" 
                                onClick={() => navigate("/dukungan")}
                            >
                                <Vote size={18} /> VOTE SEKARANG
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap" 
                                onClick={() => navigate("/leaderboard")}
                            >
                                <TrendingUp size={18} /> CEK KLASEMEN
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:flex relative w-80 h-80 bg-white rounded-[2rem] rotate-3 hover:rotate-0 transition-transform duration-500 items-center justify-center shadow-2xl border-4 border-gray-100 shrink-0">
                        <img src="/LOGO FORBASI.png" alt="Logo FORBASI" className="w-56 h-56 object-contain" />
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-2">Panduan</p>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900">Cara Memberikan Dukungan</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {votingSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isEmerald = step.bg === 'emerald';
                        return (
                            <div key={index} className={`rounded-3xl p-8 shadow-sm border transition-all duration-300 hover:-translate-y-2 ${isEmerald ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white text-gray-800'}`}>
                                <Icon size={32} className="mb-4" />
                                <h3 className="text-lg font-black mb-2">{step.title}</h3>
                                <p className={`text-sm mb-6 ${isEmerald ? 'text-emerald-100' : 'text-gray-500'}`}>{step.desc}</p>
                                <Link to={step.link} className={`text-xs font-bold px-4 py-3 rounded-lg block text-center ${isEmerald ? 'bg-white text-emerald-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {step.btnLabel}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="py-10 px-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-black text-center mb-8">Pertanyaan Seputar Voting</h2>
                    <div className="flex flex-col gap-3">
                        {faqItems.map((item, i) => <Collapse key={i} title={item.title} description={item.description} />)}
                    </div>
                </div>
            </section>
        </div>
    );
}

