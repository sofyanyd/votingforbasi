import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useEventStore } from "../../../stores/eventStore";

export default function EventIndex() {
  // Ambil data dan fungsi dari Zustand Store
  const { events, loading, fetchEvents, deleteEvent } = useEventStore();

  // Ambil data dari database saat komponen pertama kali dimuat
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Fungsi untuk menangani penghapusan data event
  const handleDelete = async (id: number, namaEvent: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus event "${namaEvent}"?`);
    if (confirmDelete) {
      const success = await deleteEvent(id);
      if (success) {
        alert("Event berhasil dihapus.");
      } else {
        alert("Gagal menghapus event.");
      }
    }
  };

  return (
    <div className="px-10 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#7B1D3F]">
            Data Event
          </h1>
          <p className="text-sm text-gray-400">
            Kelola semua data manajemen event
          </p>
        </div>

        <Link
          to="/dashboard/event/create"
          className="bg-[#7B1D3F] text-white px-4 py-2 rounded-lg shadow hover:bg-[#5a152e]"
        >
          Tambah Event
        </Link>
      </div>

      {/* KOTAK TABEL */}
      <div className="bg-white shadow-lg rounded-xl p-5">

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="text-center py-6 text-sm text-gray-500">
            Sedang memuat data dari database cloud...
          </div>
        )}

        {/* DATA KOSONG */}
        {!loading && events.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-400">
            Belum ada data event yang tersedia.
          </div>
        )}

        {/* TABEL DATA */}
        {!loading && events.length > 0 && (
          <table className="w-full text-sm">

            {/* HEADER TABEL */}
            <thead>
              <tr className="text-gray-400 text-xs">
                <th className="py-3 text-left">No</th>
                <th className="text-left">Nama Event</th>
                <th className="text-left">Kategori</th>
                <th className="text-left">Lokasi</th>
                <th className="text-left">Tanggal</th>
                <th className="text-left">Aksi</th>
              </tr>
            </thead>

            {/* ISI TABEL */}
            <tbody>
              {events.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">

                  <td className="py-4 text-gray-400">
                    {index + 1}
                  </td>

                  <td className="font-medium text-[#1a0a10]">
                    {item.nama}
                  </td>

                  <td>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md text-xs font-semibold">
                      {item.category?.nama || "Umum"}
                    </span>
                  </td>

                  <td className="text-gray-500">
                    {item.lokasi}
                  </td>

                  <td className="text-gray-500">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>

                  <td>
                    <div className="flex gap-2">
                      {/* TOMBOL EDIT BERUPA LINK MENUJU HALAMAN EDIT SESUAI ID */}
                      <Link 
                        to={`/dashboard/event/edit/${item.id}`}
                        className="px-3 py-1 text-xs rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-center flex items-center"
                      >
                        Edit
                      </Link>
                      
                      <button 
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* FOOTER */}
        <div className="mt-4 text-xs text-gray-400">
          Total: {events.length} event
        </div>

      </div>
    </div>
  );
}