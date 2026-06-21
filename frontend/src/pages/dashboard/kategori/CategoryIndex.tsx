import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategoryStore } from "../../../stores/categoryStore";

export default function CategoryIndex() {
  // Ambil data dan fungsi dari Zustand Store Kategori
  const { categories, loading, fetchCategories, deleteCategory } = useCategoryStore();

  // Ambil data asli dari database cloud saat halaman dimuat
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fungsi penanganan hapus kategori
  const handleDelete = async (id: number, namaKategori: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus kategori "${namaKategori}"?`);
    if (confirmDelete) {
      const success = await deleteCategory(id);
      if (success) {
        alert("Kategori berhasil dihapus.");
      } else {
        alert("Gagal menghapus kategori.");
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#7B1D3F]">
            Data Kategori
          </h1>
          <p className="text-sm text-gray-500">
            Kelola kategori event kamu
          </p>
        </div>

        <Link
          to="/dashboard/category/create"
          className="bg-[#7B1D3F] text-white px-5 py-2 rounded-xl shadow-md hover:bg-[#5a152e] transition"
        >
          Tambah Kategori
        </Link>
      </div>

      {/* LAYOUT GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* LIST KATEGORI DARI DATABASE */}
        <div className="md:col-span-2 space-y-4">
          
          {/* LOADING INDICATOR */}
          {loading && (
            <div className="text-center py-10 text-sm text-gray-500 bg-white rounded-2xl shadow-lg border border-gray-100">
              Sedang memuat data dari database cloud...
            </div>
          )}

          {/* DATA KOSONG */}
          {!loading && categories.length === 0 && (
            <div className="text-center py-10 text-sm text-gray-400 bg-white rounded-2xl shadow-lg border border-gray-100">
              Belum ada data kategori yang tersedia.
            </div>
          )}

          {/* RENDER DATA */}
          {!loading && categories.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex justify-between items-center hover:scale-[1.01] transition"
            >
              {/* LEFT */}
              <div>
                <h2 className="font-semibold text-lg text-[#1a0a10]">
                  {item.nama} {/* Menggunakan item.nama sesuai field backend */}
                </h2>
                <div className="mt-1 text-xs text-gray-400">
                  ID Kategori: {item.id}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/category/edit/${item.id}`}
                  className="px-3 py-1.5 text-sm rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-center flex items-center"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(item.id, item.nama)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SIDE INFO RINGKASAN */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 h-fit">
          <h3 className="font-semibold text-[#7B1D3F] mb-3">
            Ringkasan
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Total Kategori</span>
              <span className="font-bold">{categories.length}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}