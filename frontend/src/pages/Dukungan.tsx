import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button"; 
import { Ticket, Sparkles } from "lucide-react";

export default function Dukungan() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 font-sans min-h-screen pb-20">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="bg-white border-b border-slate-200 overflow-hidden relative">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-emerald-50 blur-3xl opacity-40 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest border border-emerald-100">
              <Sparkles size={16} className="text-emerald-500" /> Official Ticketing
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Berikan <span className="text-emerald-600">Dukunganmu</span>
            </h1>

            <h2 className="text-xl md:text-2xl text-slate-700 font-bold">
              Bantu Pleton Jagoanmu Meraih Gelar Juara Favorit!
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed max-w-lg mb-8">
              Dukungan dari kamu sangat berarti bagi para finalis. Beli tiket voting resmi dengan mudah layaknya berbelanja online. Pilih peserta favoritmu, tentukan jumlah suaranya, dan jadikan mereka juara!
            </p>

            <div className="pt-2">
              <Button 
                variant="primary" 
                onClick={() => navigate("/catalogvote")} // Sesuaikan path ini dengan router kamu
                className="flex items-center justify-center gap-2 shadow-emerald-200 shadow-lg"
              >
                <Ticket size={20} />
                BELI TIKET VOTE SEKARANG
              </Button>
            </div>
          </div>

          {/* Visual Hero Kanan */}
          <div className="hidden md:flex relative w-80 h-80 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-[2rem] rotate-3 hover:rotate-0 transition-transform duration-500 items-center justify-center shadow-2xl border-4 border-white shrink-0">
            <Ticket className="text-white opacity-90" size={120} />
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT SECTION ── */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 md:p-16">
            <h2 className="text-3xl font-black text-slate-900 mb-6">
              Sistem <span className="text-emerald-600">Voting Terbuka</span>
            </h2>
            <p className="text-slate-500 leading-relaxed text-lg">
              Kategori <strong className="text-slate-800">Juara Favorit</strong> sepenuhnya ditentukan oleh besarnya antusiasme dan dukungan dari suporter, alumni, maupun masyarakat umum. Dengan sistem pembelian tiket vote ini, kami menjamin keamanan data dan transparansi penuh dalam setiap langkah.
            </p>
        </div>
      </section>
      
    </div>
  );
}