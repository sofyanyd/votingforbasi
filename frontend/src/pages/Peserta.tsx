import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Collapse } from "../components/ui/Collapse";
import { Calendar, Clock, MapPin, CheckCircle, Users, Sparkles } from "lucide-react";

export default function Peserta() {
  const navigate = useNavigate();

  const [finalists, setFinalists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinalists = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/speakers`);
        const mapped = response.data.map((item: any) => {
          let no_urut = "01";
          let role = item.bidang;
          if (item.bidang.startsWith("No. ") && item.bidang.includes(" - ")) {
            const parts = item.bidang.substring(4).split(" - ");
            no_urut = parts[0].trim();
            role = parts[1].trim();
          }
          return {
            id: item.id,
            name: item.nama,
            role: role,
            no_urut: no_urut,
            imageUrl: item.foto_url || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(item.nama)}`
          };
        });
        setFinalists(mapped);
      } catch (error) {
        console.error("Gagal mengambil data finalis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinalists();
  }, []);

  const faqItems = [
    {
      title: "Bagaimana kriteria penentuan Juara Favorit?",
      description: "Juara Favorit murni ditentukan dari akumulasi jumlah tiket vote (dukungan) yang masuk melalui platform voting ini. Tidak ada intervensi dari nilai dewan juri lapangan.",
    },
    {
      title: "Apakah saya bisa melihat profil detail setiap pleton?",
      description: "Saat ini, informasi yang ditampilkan mencakup nama pleton, asal instansi, dan nomor urut tampil. Foto resmi akan diunggah oleh panitia setelah sesi technical meeting.",
    },
    {
      title: "Di mana saya bisa memberikan vote untuk mereka?",
      description: "Kamu bisa pergi ke menu 'Dukungan' di bagian atas, lalu klik tombol Beli Tiket Vote untuk masuk ke halaman Katalog Voting resmi kami.",
    },
  ];

  return (
    <div className="bg-slate-50 font-sans min-h-screen pb-20">

      {/* ── 1. HERO SECTION (CENTERED LAYOUT) ── */}
      <section className="bg-white border-b border-slate-200 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-emerald-50 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-6 border border-emerald-100">
            <Sparkles size={16} className="text-emerald-500" /> KANDIDAT JUARA
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Galeri <span className="text-emerald-600">Peserta</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
            Kenali seluruh pleton tangguh yang akan bertanding memperebutkan piala bergilir dan gelar Juara Favorit di KEJURCAB. Tentukan jagoanmu dari sekarang!
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button label="LIHAT LEADERBOARD" variant="primary" onClick={() => navigate("/leaderboard")} />
            <Button label="BERIKAN DUKUNGAN" variant="outline" onClick={() => navigate("/dukungan")} />
          </div>
        </div>
      </section>

      {/* ── 2. INFO BAR (HORIZONTAL LAYOUT) ── */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 mb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-2 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {[
            { icon: Calendar, title: "Tanggal", val: "26 Okt 2026" },
            { icon: Clock, title: "Waktu", val: "07.00 WIB" },
            { icon: MapPin, title: "Lokasi", val: "Lapangan Utama" },
            { icon: CheckCircle, title: "Juara", val: "16.00 WIB" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex items-center justify-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl md:rounded-none first:rounded-t-xl md:first:rounded-l-xl md:first:rounded-tr-none last:rounded-b-xl md:last:rounded-r-xl md:last:rounded-bl-none">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.title}</p>
                <h4 className="font-bold text-slate-900 text-sm">{item.val}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. GRID PESERTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Users className="text-emerald-600" size={28} />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Daftar Pleton</h2>
          </div>
          <span className="bg-slate-200 text-slate-600 text-xs font-black px-3 py-1 rounded-md uppercase tracking-widest">
            {finalists.length} Peserta
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold bg-white rounded-3xl border border-slate-200 shadow-sm">
            Sedang memuat data pleton peserta...
          </div>
        ) : finalists.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-3xl border border-slate-200 shadow-sm">
            Belum ada data pleton peserta.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {finalists.map((f) => (
              <Card key={f.id} className="group p-2 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 border-slate-200">
                {/* Foto Peserta */}
                <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden mb-3">
                  <img
                    src={f.imageUrl}
                    alt={f.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Info Peserta */}
                <div className="px-2 pb-2 text-center flex flex-col items-center flex-grow">
                  <span className="bg-emerald-50 text-emerald-700 font-black text-[10px] px-3 py-1 rounded-full mb-2">
                    NO. {f.no_urut}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight mb-1 truncate w-full">
                    {f.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate w-full font-medium">
                    {f.role}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── 4. FAQ SECTION (SPLIT LAYOUT) ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1 sticky top-24">
            <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
              Punya <span className="text-emerald-600">Pertanyaan?</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Berikut adalah beberapa pertanyaan yang sering diajukan seputar peserta dan mekanisme pemilihan juara favorit.
            </p>
            <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col gap-3">
            {faqItems.map((item, index) => (
              <Collapse
                key={index}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}