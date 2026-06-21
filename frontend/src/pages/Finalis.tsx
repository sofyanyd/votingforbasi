import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { Collapse } from "../components/ui/Collapse";
import { Calendar, Clock, MapPin, CheckCircle, Users, Award } from "lucide-react";

export default function Finalis() {
  const navigate = useNavigate();
  
  const finalists = [
    { id: 1, name: "Pleton Alpha", role: "SMAN 1 Kota", no_urut: "01", imageUrl: "https://via.placeholder.com/400x400.png?text=Pleton+Alpha" },
    { id: 2, name: "Pleton Bravo", role: "SMKN 2 Kota", no_urut: "02", imageUrl: "https://via.placeholder.com/400x400.png?text=Pleton+Bravo" },
    { id: 3, name: "Pleton Charlie", role: "MAN 1 Kota", no_urut: "03", imageUrl: "https://via.placeholder.com/400x400.png?text=Pleton+Charlie" },
    { id: 4, name: "Pleton Delta", role: "SMAN 4 Kota", no_urut: "04", imageUrl: "https://via.placeholder.com/400x400.png?text=Pleton+Delta" },
    { id: 5, name: "Pleton Echo", role: "SMKN 1 Kota", no_urut: "05", imageUrl: "https://via.placeholder.com/400x400.png?text=Pleton+Echo" },
  ];

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1 rounded-full font-bold text-sm">
              <Award size={16} /> ROAD TO CHAMPION
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
              Daftar <span className="text-blue-600">Finalis</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Kenali para pejuang baris-berbaris yang akan berkompetisi di LKBB Alfabet 5. Siapkan dukunganmu untuk mereka!
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button label="LIHAT LEADERBOARD" variant="primary" onClick={() => navigate("/voting/leaderboard")} />
              <Button label="BERIKAN DUKUNGAN" variant="outline" onClick={() => navigate("/voting/dukungan")} />
            </div>
          </div>

          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10"></div>
            <div className="relative w-full h-full bg-blue-600 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl">
               <Users size={120} className="text-white opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. GRID PESERTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-gray-900">Gallery Finalis</h2>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{finalists.length} TOTAL PESERTA</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {finalists.map((f) => (
            <div key={f.id} className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="px-2 pb-2 text-center">
                <div className="text-[10px] font-black text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-full mb-1">NO. {f.no_urut}</div>
                <h3 className="font-bold text-gray-900 text-sm truncate">{f.name}</h3>
                <p className="text-[11px] text-gray-400 truncate">{f.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. INFO SECTION ── */}
      <section className="bg-white py-20 px-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Calendar, title: "Tanggal", val: "26 Okt 2026" },
            { icon: Clock, title: "Waktu", val: "07.00 WIB" },
            { icon: MapPin, title: "Lokasi", val: "Lapangan Utama" },
            { icon: CheckCircle, title: "Juara", val: "16.00 WIB" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <item.icon size={24} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.title}</p>
              <h4 className="font-bold text-gray-900">{item.val}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}