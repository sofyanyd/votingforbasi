import React, { useState, useEffect } from "react";
import { useAnggotaStore, type Anggota } from "../../../stores/useAnggotaStore";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  X, 
  Image as ImageIcon 
} from "lucide-react";

export default function AnggotaManagemen() {
  const { anggotaList, addAnggota, updateAnggota, deleteAnggota } = useAnggotaStore();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [namaKlub, setNamaKlub] = useState("");
  const [sekolah, setSekolah] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [statusKta, setStatusKta] = useState<"Aktif" | "Pending" | "Ditolak">("Pending");
  const [foto, setFoto] = useState("");
  const [fotoPreview, setFotoPreview] = useState("");

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "loading" | "error" | null }>({
    message: "",
    type: null,
  });

  // Inject font Plus Jakarta Sans
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const showToast = (message: string, type: "success" | "loading" | "error") => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => setToast({ message: "", type: null }), 3000);
    }
  };

  // Handle Photo File Upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file foto maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFoto(result);
        setFotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate initial SVG Avatar
  const generateInitialAvatar = (clubName: string) => {
    const initials = clubName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const colors = ["#00a54f", "#6366f1", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
    // Deterministic color based on name length
    const color = colors[clubName.length % colors.length];
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="${encodeURIComponent(color)}"/><text x="50" y="55" font-family="sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">${initials}</text></svg>`;
  };

  // Open Modal
  const openModal = (anggota?: Anggota) => {
    if (anggota) {
      setEditingId(anggota.id);
      setNamaKlub(anggota.namaKlub);
      setSekolah(anggota.sekolah);
      setEmail(anggota.email);
      setTelepon(anggota.telepon);
      setStatusKta(anggota.statusKta);
      setFoto(anggota.foto);
      setFotoPreview(anggota.foto);
    } else {
      setEditingId(null);
      setNamaKlub("");
      setSekolah("");
      setEmail("");
      setTelepon("");
      setStatusKta("Pending");
      setFoto("");
      setFotoPreview("");
    }
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaKlub.trim() || !sekolah.trim() || !email.trim() || !telepon.trim()) {
      alert("Semua field wajib diisi!");
      return;
    }

    const finalFoto = foto || generateInitialAvatar(namaKlub);

    const dataPayload = {
      namaKlub,
      sekolah,
      email,
      telepon,
      statusKta,
      foto: finalFoto,
    };

    if (editingId) {
      updateAnggota(editingId, dataPayload);
      showToast("Anggota berhasil diperbarui!", "success");
    } else {
      addAnggota(dataPayload);
      showToast("Anggota berhasil ditambahkan!", "success");
    }

    setIsModalOpen(false);
  };

  // Delete Action
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus klub "${name}"?`)) {
      deleteAnggota(id);
      showToast("Anggota berhasil dihapus!", "success");
    }
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    showToast("Mengekspor data ke Excel...", "loading");

    setTimeout(() => {
      const headers = ["No", "ID Anggota", "Nama Klub", "Sekolah", "Email", "Telepon", "Status KTA"];
      const rows = filteredList.map((item, idx) => [
        idx + 1,
        item.id,
        item.namaKlub,
        item.sekolah,
        item.email,
        item.telepon,
        item.statusKta,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((val) => {
              const cleanVal = String(val ?? "").replace(/"/g, '""');
              return cleanVal.includes(",") || cleanVal.includes("\n") || cleanVal.includes('"')
                ? `"${cleanVal}"`
                : cleanVal;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Data_Anggota_KTA_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("File Excel/CSV berhasil diunduh!", "success");
    }, 1000);
  };

  // Filtered List
  const filteredList = anggotaList.filter((item) => {
    const matchesSearch =
      item.namaKlub.toLowerCase().includes(search.toLowerCase()) ||
      item.sekolah.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.telepon.includes(search);

    const matchesStatus = filterStatus === "Semua" || item.statusKta === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className="w-full bg-[#f8fafc] rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8 space-y-8 text-slate-800 transition-all duration-300"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Toast Alert */}
      {toast.type && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-slate-100 shadow-2xl p-4 rounded-2xl animate-bounce">
          {toast.type === "loading" ? (
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          ) : toast.type === "success" ? (
            <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs">✓</div>
          ) : (
            <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xs">✗</div>
          )}
          <span className="text-sm font-semibold text-slate-700">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Manajemen Anggota</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Daftar klub olahraga terafiliasi Kota Tegal</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={handleExportExcel}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-emerald-200 hover:border-emerald-500 text-emerald-600 hover:bg-emerald-50/20 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Download size={16} />
            Export Excel
          </button>
          <button
            onClick={() => openModal()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 bg-[#00a54f] hover:bg-[#008f44] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            <Plus size={16} />
            Tambah Anggota
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/40 p-4 rounded-2xl border border-slate-100">
        {/* Search */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama klub, sekolah, email atau nomor telepon..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
          <Search size={18} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Status KTA</option>
            <option value="Aktif">Aktif</option>
            <option value="Pending">Pending</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-xs">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4 w-16">Foto</th>
                <th className="p-4">Nama Klub</th>
                <th className="p-4">Sekolah</th>
                <th className="p-4">Email</th>
                <th className="p-4">Telepon</th>
                <th className="p-4 text-center">Status KTA</th>
                <th className="p-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredList.length > 0 ? (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-center font-semibold text-slate-400">{idx + 1}</td>
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                        <img 
                          src={item.foto} 
                          alt={item.namaKlub} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            // fallback if error loading image
                            (e.target as HTMLImageElement).src = generateInitialAvatar(item.namaKlub);
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{item.namaKlub}</td>
                    <td className="p-4 font-semibold text-slate-500">{item.sekolah}</td>
                    <td className="p-4 text-slate-500 text-xs">{item.email}</td>
                    <td className="p-4 text-slate-500 text-xs">{item.telepon}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-bold text-[10px] ${
                          item.statusKta === "Aktif"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.statusKta === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {item.statusKta}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(item)}
                          title="Edit"
                          className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-400 transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.namaKlub)}
                          title="Hapus"
                          className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold text-sm">
                    Tidak ditemukan data anggota yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? "Edit Anggota Klub" : "Tambah Anggota Klub"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0 relative">
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-slate-300 w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-slate-500 mb-1">FOTO KLUB/SEKOLAH</span>
                  <label className="inline-block py-1.5 px-3 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:border-emerald-500 hover:text-[#00a54f] cursor-pointer transition-colors shadow-sm">
                    Pilih File Gambar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <span className="block text-[10px] text-slate-400 mt-1">Format JPG/PNG, maks. 2MB. Kosongkan untuk menggunakan inisial.</span>
                </div>
              </div>

              {/* Nama Klub */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nama Klub *
                </label>
                <input
                  type="text"
                  required
                  value={namaKlub}
                  onChange={(e) => setNamaKlub(e.target.value)}
                  placeholder="Contoh: Paskagama Sakti"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Sekolah */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Afiliasi Sekolah *
                </label>
                <input
                  type="text"
                  required
                  value={sekolah}
                  onChange={(e) => setSekolah(e.target.value)}
                  placeholder="Contoh: SMK N 3 KOTA TEGAL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Telepon */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Telepon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value.replace(/[^0-9+]/g, ""))}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Status KTA */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Status KTA *
                </label>
                <div className="relative">
                  <select
                    value={statusKta}
                    onChange={(e) => setStatusKta(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Pending">Pending</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#00a54f] hover:bg-[#008f44] text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
