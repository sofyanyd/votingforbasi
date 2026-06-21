import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePembicaraStore } from "../../../stores/pembicaraStore"; // Import store pembicara

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-[#7B1D3F] text-white text-xs font-bold flex items-center justify-center">
      {initials}
    </div>
  );
}

export default function PembicaraIndex() {
  // Ambil state dan fungsi dari Zustand Store pembicara
  const { pembicaraList, loading, fetchPembicara, deletePembicara } = usePembicaraStore();

  // Ambil data asli dari cloud database saat komponen pertama kali dimuat
  useEffect(() => {
    fetchPembicara();
  }, [fetchPembicara]);

  // Fungsi untuk menangani penghapusan data pembicara
  const handleDelete = async (id: number, namaPembicara: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus pembicara "${namaPembicara}"?`);
    if (confirmDelete) {
      const success = await deletePembicara(id);
      if (success) {
        alert("Pembicara berhasil dihapus.");
      } else {
        alert("Gagal menghapus pembicara.");
      }
    }
  };

  return (
    <div className="px-10 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#7B1D3F]">
            Pembicara
          </h1>
          <p className="text-sm text-gray-400">
            Kelola pembicara event
          </p>
        </div>

        <Link
          to="/dashboard/pembicara/create"
          className="bg-[#7B1D3F] text-white px-4 py-2 rounded-lg shadow hover:bg-[#5a152e]"
        >
          Tambah
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg p-4">

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="text-center py-6 text-sm text-gray-500">
            Sedang memuat data pembicara dari cloud database...
          </div>
        )}

        {/* DATA KOSONG */}
        {!loading && pembicaraList.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-400">
            Belum ada data pembicara yang tersedia.
          </div>
        )}

        {/* DATA TABEL UTAMA */}
        {!loading && pembicaraList.length > 0 && (
          <table className="w-full text-sm">

            <thead>
              <tr className="text-gray-400 text-xs uppercase">
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Bidang / Role</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {pembicaraList.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">

                  <td className="px-4 py-4 text-gray-400">
                    {index + 1}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={item.nama} />
                      <span className="font-semibold text-[#1a0a10]">
                        {item.nama}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-md text-xs font-medium text-gray-700">
                      {item.bidang}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {/* Tombol Edit diubah menjadi Link dinamis sesuai ID pembicara */}
                      <Link 
                        to={`/dashboard/pembicara/edit/${item.id}`}
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
          Total: {pembicaraList.length} pembicara
        </div>

      </div>
    </div>
  );
}