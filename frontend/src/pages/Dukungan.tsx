import { useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";

export default function Dukungan() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 font-sans rounded-xl overflow-hidden shadow-sm border border-gray-100">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <p className="text-blue-600 font-bold tracking-wider text-sm mb-2 uppercase">
            Official Ticketing
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Berikan <span className="text-blue-600">Dukunganmu</span>
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-700 mb-6 font-semibold">
            Bantu Pleton Jagoanmu Meraih Gelar Juara Favorit!
          </h2>

          <p className="text-gray-500 leading-relaxed mb-8">
            Dukungan dari kamu sangat berarti bagi para finalis. Beli tiket voting resmi dengan mudah layaknya berbelanja online. Pilih peserta favoritmu, tentukan jumlah suaranya, dan jadikan mereka juara!
          </p>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/voting/catalogvote")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              <Ticket size={20} />
              BELI TIKET VOTE SEKARANG
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-72 h-72 bg-blue-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
            <Ticket className="text-blue-300" size={120} />
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT SECTION ── */}
      <section className="py-16 px-6 text-center bg-white border-y border-gray-100">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
          Sistem <span className="text-blue-600">Voting Terbuka</span>
        </h2>
        <p className="max-w-3xl mx-auto text-gray-500 leading-relaxed">
          Kategori <strong>Juara Favorit</strong> sepenuhnya ditentukan oleh besarnya antusiasme dan dukungan dari suporter, alumni, maupun masyarakat umum. Dengan sistem pembelian tiket vote ini, kami menjamin keamanan data dan transparansi penuh dalam setiap langkah.
        </p>
      </section>
    </div>
  );
}