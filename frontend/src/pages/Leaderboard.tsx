import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Collapse } from "../components/ui/Collapse";

export default function Leaderboard() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/votes/leaderboard`);
        setStandings(response.data);
      } catch (error) {
        console.error("Gagal mengambil data papan klasemen:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, []);

  const leaderboardFaqs = [
    {
      title: "Seberapa sering Leaderboard ini diperbarui?",
      description: "Data perolehan suara diperbarui secara real-time. Setiap kali ada voter yang berhasil mengirimkan dukungannya, angka di halaman ini akan langsung berubah.",
    },
    {
      title: "Apakah hasil di Leaderboard ini sudah final?",
      description: "Tidak, ini adalah hasil sementara. Hasil akhir yang sah akan diumumkan langsung oleh panitia pada acara puncak kompetisi.",
    },
    {
      title: "Apa yang terjadi jika ada dua pleton dengan nilai yang sama?",
      description: "Jika terjadi hasil seri pada akhir periode voting, panitia akan menentukan mekanisme keputusan berdasarkan aturan tambahan yang berlaku di juknis lomba.",
    },
  ];

  const topThree = standings.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* ── 1. HERO SECTION: PODIUM TOP 3 ── */}
      <section className="bg-white border-b border-slate-200 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8 md:mb-12">
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Update
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-6 mb-3 tracking-tight">
              Klasemen <span className="text-emerald-600">Sementara</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto px-4 md:px-0">
              Persaingan ketat perolehan dukungan KEJURCAB. Berikan terus dukungan untuk pleton jagoanmu!
            </p>
          </div>

{/* Tampilan Podium Responsif (DIPAKSA BERJEJER DI HP) */}
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-semibold">
              Sedang memuat data papan klasemen...
            </div>
          ) : standings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-medium">
              Belum ada data vote yang tercatat.
            </div>
          ) : (
            // UBAH: flex-row dipertahankan untuk HP, gap dikecilkan jadi gap-2, padding px-2
            <div className="flex flex-row items-end justify-center gap-2 md:gap-4 max-w-3xl mx-auto mt-4 md:mt-8 pt-2 md:pt-6 px-2">
              
              {/* Peringkat 2 (Kiri) */}
              {topThree[1] && (
                <div className="w-1/3 flex flex-col items-center order-1 transition-transform hover:-translate-y-1">
                  <div className="text-center mb-1 md:mb-3 px-1">
                    {/* line-clamp-2: Kalau nama panjang, maksimal 2 baris lalu titik-titik */}
                    <p className="font-bold text-slate-800 text-[10px] md:text-base line-clamp-2 md:truncate">{topThree[1].nama}</p>
                    <p className="text-[9px] md:text-sm text-emerald-600 font-black mt-0.5">{topThree[1].votes.toLocaleString()} Votes</p>
                  </div>
                  {/* Tinggi kotak dikecilkan jadi h-20 di HP */}
                  <div className="w-full bg-slate-100 border-t-2 md:border-t-4 border-slate-400 rounded-t-lg md:rounded-t-2xl p-2 md:p-6 h-20 md:h-36 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-200/80 to-transparent opacity-50"></div>
                    <span className="text-2xl md:text-4xl font-black text-slate-400 relative z-10">2</span>
                  </div>
                </div>
              )}

              {/* Peringkat 1 (Tengah) */}
              {topThree[0] && (
                <div className="w-1/3 flex flex-col items-center order-2 transition-transform hover:-translate-y-2 z-10">
                  <div className="text-center mb-2 md:mb-4 scale-100 md:scale-110 px-1">
                    <div className="text-amber-400 text-xl md:text-3xl mb-0.5 animate-bounce drop-shadow-sm">👑</div>
                    <p className="font-black text-slate-900 text-[11px] md:text-lg line-clamp-2 md:truncate">{topThree[0].nama}</p>
                    <p className="text-[9px] md:text-sm text-emerald-700 font-black bg-emerald-50 border border-emerald-100 px-1.5 md:px-3 py-0.5 md:py-1 rounded md:rounded-lg inline-block mt-1 shadow-sm">
                      {topThree[0].votes.toLocaleString()} <span className="hidden sm:inline">Votes</span>
                    </p>
                  </div>
                  {/* Tinggi kotak dikecilkan jadi h-28 di HP */}
                  <div className="w-full bg-gradient-to-t from-amber-50 to-amber-100 border-t-2 md:border-t-4 border-amber-400 rounded-t-lg md:rounded-t-2xl p-2 md:p-6 h-28 md:h-48 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-200/50 to-transparent opacity-50"></div>
                    <span className="text-4xl md:text-5xl font-black text-amber-500 drop-shadow-sm relative z-10">1</span>
                  </div>
                </div>
              )}

              {/* Peringkat 3 (Kanan) */}
              {topThree[2] && (
                <div className="w-1/3 flex flex-col items-center order-3 transition-transform hover:-translate-y-1">
                  <div className="text-center mb-1 md:mb-3 px-1">
                    <p className="font-bold text-slate-800 text-[10px] md:text-base line-clamp-2 md:truncate">{topThree[2].nama}</p>
                    <p className="text-[9px] md:text-sm text-emerald-600 font-black mt-0.5">{topThree[2].votes.toLocaleString()} Votes</p>
                  </div>
                  {/* Tinggi kotak dikecilkan jadi h-16 di HP */}
                  <div className="w-full bg-orange-50 border-t-2 md:border-t-4 border-orange-400 rounded-t-lg md:rounded-t-2xl p-2 md:p-6 h-16 md:h-28 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-orange-100/80 to-transparent opacity-50"></div>
                    <span className="text-xl md:text-3xl font-black text-orange-400 relative z-10">3</span>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </section>

      {/* ── 2. DETAIL RANKING SECTION ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide uppercase flex items-center gap-2">
              Daftar Lengkap
            </h2>
        </div>
        
        {/* UBAH TABEL: Saya biarkan format Grid, tapi perbaiki proporsi kolomnya biar pas di HP */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Tabel */}
          <div className="grid grid-cols-12 bg-slate-50 px-3 md:px-6 py-3 md:py-4 border-b border-slate-200 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            <div className="col-span-2 text-center">Pos</div>
            <div className="col-span-6 md:col-span-6 pl-2">Peserta</div>
            <div className="col-span-4 md:col-span-4 text-right">Perolehan</div>
          </div>

          {/* Isi List/Tabel */}
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="text-center py-10 text-slate-500 font-medium text-sm">
                Sedang memuat data klasemen...
              </div>
            ) : standings.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-medium text-sm">
                Belum ada perolehan suara.
              </div>
            ) : (
              standings.map((team) => (
                <div key={team.id} className="grid grid-cols-12 px-3 md:px-6 py-4 md:py-5 items-center hover:bg-emerald-50/40 transition-colors cursor-default">
                  
                  {/* Kolom Peringkat */}
                  <div className="col-span-2 text-center flex justify-center">
                     <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 text-slate-600 font-black text-xs md:text-sm">
                         {team.rank}
                     </span>
                  </div>
                  
                  {/* Kolom Nama */}
                  <div className="col-span-6 md:col-span-6 pl-2 pr-2 md:pr-4">
                    <p className="font-bold text-slate-900 text-xs md:text-sm leading-tight line-clamp-2 md:line-clamp-1">{team.nama}</p>
                    <p className="text-[10px] md:text-[11px] text-slate-400 font-semibold uppercase truncate mt-1">{team.instansi}</p>
                    
                    <div className="w-full bg-slate-100 h-1 md:h-1.5 rounded-full mt-2 overflow-hidden hidden sm:block">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${team.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Kolom Vote */}
                  <div className="col-span-4 md:col-span-4 text-right">
                    <p className="font-black text-emerald-600 text-sm md:text-lg">{team.votes.toLocaleString()}</p>
                    <p className="text-[9px] md:text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 inline-block px-1.5 md:px-2 py-0.5 rounded mt-1">
                      {team.percentage}%
                    </p>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── 3. FAQ SECTION ── */}
      <section className="max-w-4xl mx-auto px-6 py-10 md:py-12">
        <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              Informasi <span className="text-emerald-600">Papan Peringkat</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              Punya pertanyaan seputar regulasi validasi data skor? Temukan jawabannya di bawah ini.
            </p>
        </div>

        <div className="flex flex-col gap-3">
          {leaderboardFaqs.map((item, index) => (
            <Collapse
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

    </div>
  );
}