import { useState, useEffect } from "react";

export default function Leaderboard() {
  // Data dummy perolehan suara (Nantinya tersambung ke API/Backend)
  const [standings, setStandings] = useState([
    { id: 1, rank: 1, nama: "Pleton Alpha", instansi: "SMAN 1 Kota", votes: 1250, percentage: 42 },
    { id: 2, rank: 2, nama: "Pleton Bravo", instansi: "SMKN 2 Kota", votes: 980, percentage: 33 },
    { id: 3, rank: 3, nama: "Pleton Charlie", instansi: "MAN 1 Kota", votes: 520, percentage: 17 },
    { id: 4, rank: 4, nama: "Pleton Delta", instansi: "SMAN 4 Kota", votes: 210, percentage: 8 },
  ]);

  // FAQ khusus seputar papan peringkat
  const leaderboardFaqs = [
    {
      title: "Seberapa sering Leaderboard ini diperbarui?",
      description: "Data perolehan suara diperbarui secara real-time. Setiap kali ada voter yang berhasil mengirimkan dukungannya, angka di halaman ini akan langsung berubah.",
    },
    {
      title: "Apakah hasil di Leaderboard ini sudah final?",
      description: "Tidak, ini adalah hasil sementara. Hasil akhir yang sah akan diumumkan langsung oleh panitia pada acara puncak LKBB Alfabet 5 2026.",
    },
    {
      title: "Apa yang terjadi jika ada dua pleton dengan nilai yang sama?",
      description: "Jika terjadi hasil seri pada akhir periode voting, panitia akan menentukan mekanisme keputusan berdasarkan aturan tambahan yang berlaku di juknis lomba.",
    },
  ];

  // Mengambil 3 pleton teratas untuk ditampilkan di area podium Hero
  const topThree = standings.slice(0, 3);
  // Sisa pleton di luar top 3 untuk tabel di bawah
  const remainingTeams = standings.slice(3);

  return (
    <div className="min-h-screen bg-white font-sans rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* ── 1. HERO SECTION: PODIUM TOP 3 ── */}
      <section className="px-6 py-12 max-w-6xl mx-auto text-center">
        <div className="mb-10">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Live Update
          </span>
          <h1 className="text-4xl font-black text-gray-950 mt-3 mb-2">Klasemen Sementara</h1>
          <p className="text-gray-500 text-sm">Persaingan ketat perolehan dukungan LKBB Alfabet 5 Tahun 2026</p>
        </div>

        {/* Tampilan Podium Responsif */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 max-w-3xl mx-auto mt-16 pt-6">
          
          {/* Peringkat 2 (Kiri) */}
          {topThree[1] && (
            <div className="w-full md:w-1/3 flex flex-col items-center order-2 md:order-1">
              <div className="text-center mb-2">
                <p className="font-bold text-gray-800 text-base truncate max-w-[160px]">{topThree[1].nama}</p>
                <p className="text-xs text-blue-600 font-semibold">{topThree[1].votes} Votes</p>
              </div>
              <div className="w-full bg-gray-100 border-t-4 border-gray-400 rounded-t-xl p-6 h-32 flex flex-col items-center justify-center shadow-sm">
                <span className="text-3xl font-black text-gray-400">2</span>
              </div>
            </div>
          )}

          {/* Peringkat 1 (Tengah - Lebih Tinggi) */}
          {topThree[0] && (
            <div className="w-full md:w-1/3 flex flex-col items-center order-1 md:order-2">
              <div className="text-center mb-2 scale-110">
                <div className="text-yellow-500 text-xl mb-1">👑</div>
                <p className="font-black text-gray-900 text-lg truncate max-w-[180px]">{topThree[0].nama}</p>
                <p className="text-xs text-blue-600 font-bold">{topThree[0].votes} Votes</p>
              </div>
              <div className="w-full bg-amber-50 border-t-4 border-yellow-500 rounded-t-xl p-6 h-44 flex flex-col items-center justify-center shadow-md relative z-10">
                <span className="text-4xl font-black text-yellow-600">1</span>
              </div>
            </div>
          )}

          {/* Peringkat 3 (Kanan) */}
          {topThree[2] && (
            <div className="w-full md:w-1/3 flex flex-col items-center order-3 md:order-3">
              <div className="text-center mb-2">
                <p className="font-bold text-gray-800 text-base truncate max-w-[160px]">{topThree[2].nama}</p>
                <p className="text-xs text-blue-600 font-semibold">{topThree[2].votes} Votes</p>
              </div>
              <div className="w-full bg-amber-50/40 border-t-4 border-amber-700 rounded-t-xl p-6 h-24 flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-black text-amber-800">3</span>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── 2. DETAIL RANKING SECTION (Daur ulang dari Deskripsi Kompetisi) ── */}
      <section className="bg-blue-50 py-16 px-6 border-y border-blue-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-wide text-center uppercase">
            Daftar Peringkat Lengkap
          </h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Tabel Mini */}
            <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-2 text-center">Posisi</div>
              <div className="col-span-6">Nama Pleton / Instansi</div>
              <div className="col-span-4 text-right">Total Dukungan</div>
            </div>

            {/* Isi List/Tabel */}
            <div className="divide-y divide-gray-100">
              {standings.map((team) => (
                <div key={team.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-2 text-center font-black text-gray-700">
                    #{team.rank}
                  </div>
                  <div className="col-span-6">
                    <p className="font-bold text-gray-900 text-sm md:text-base">{team.nama}</p>
                    <p className="text-xs text-gray-400 font-medium">{team.instansi}</p>
                    {/* Progress bar perolehan presentase */}
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden hidden sm:block">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${team.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="col-span-4 text-right">
                    <p className="font-black text-blue-600 text-sm md:text-base">{team.votes.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 font-bold">{team.percentage}% suara</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FAQ SECTION ── */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Informasi Papan <span className="text-blue-600">Peringkat</span>
        </h2>
        <p className="text-gray-500 mb-10 text-sm max-w-md mx-auto">
          Punya pertanyaan seputar regulasi validasi data skor? Temukan jawabannya di bawah ini.
        </p>

        <div className="space-y-4 text-left">
          {leaderboardFaqs.map((faq, i) => (
            <details
              key={i}
              className="bg-white border border-gray-200 rounded-xl px-6 py-4 text-left group cursor-pointer shadow-sm hover:border-blue-300 transition-colors"
            >
              <summary className="flex items-center justify-between text-gray-800 font-bold text-sm list-none outline-none">
                {faq.title}
                <span className="text-blue-600 font-bold group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-500 text-sm leading-relaxed border-t pt-4">
                {faq.description}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}