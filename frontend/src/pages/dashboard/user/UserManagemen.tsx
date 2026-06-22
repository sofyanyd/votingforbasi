import React, { useState, useEffect } from "react";
import { useUserStore, type UserAdmin } from "../../../stores/useUserStore";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from "lucide-react";

export default function UserManagemen() {
  const { userList, loading, fetchUsers, addUser, updateUser, deleteUser } = useUserStore();

  // Search State
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state for password visibility
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "loading" | "error" | null }>({
    message: "",
    type: null,
  });

  // Inject font Plus Jakarta Sans & Fetch users from DB
  useEffect(() => {
    fetchUsers();
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

  // Open Modal
  const openModal = (user?: UserAdmin) => {
    if (user) {
      setEditingId(user.id);
      setUsername(user.username);
      setEmail(user.email);
      setPassword(""); // Clear form password, keep blank to denote "keep current password"
    } else {
      setEditingId(null);
      setUsername("");
      setEmail("");
      setPassword("");
    }
    setShowFormPassword(false);
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      alert("Username dan Email wajib diisi!");
      return;
    }

    // Required for new user, optional for edit
    if (!editingId && !password.trim()) {
      alert("Password wajib diisi untuk user baru!");
      return;
    }

    if (password.trim() && password.length < 8) {
      alert("Password minimal 8 karakter!");
      return;
    }

    const dataPayload = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim() || undefined,
    };

    showToast("Menyimpan data...", "loading");

    let success = false;
    if (editingId) {
      success = await updateUser(editingId, dataPayload);
      if (success) {
        showToast("User admin berhasil diperbarui!", "success");
      } else {
        showToast("Gagal memperbarui user admin.", "error");
      }
    } else {
      success = await addUser(dataPayload);
      if (success) {
        showToast("User admin berhasil ditambahkan!", "success");
      } else {
        showToast("Gagal menambahkan user admin.", "error");
      }
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  // Delete Action
  const handleDelete = async (id: string, name: string) => {
    if (userList.length <= 1) {
      alert("Tidak dapat menghapus satu-satunya user admin!");
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus admin "${name}"?`)) {
      showToast("Menghapus user...", "loading");
      const success = await deleteUser(id);
      if (success) {
        showToast("User admin berhasil dihapus!", "success");
      } else {
        showToast("Gagal menghapus user admin.", "error");
      }
    }
  };

  // Toggle Password visibility in table
  const toggleTablePassword = (id: string) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered List
  const filteredList = userList.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Manajemen User Admin</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Daftar pengguna dengan akses administratif</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-[#00a54f] hover:bg-[#008f44] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} />
          Tambah Admin
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white/40 p-4 rounded-2xl border border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari admin berdasarkan username atau email..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
          <Search size={18} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-xs">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Password</th>
                <th className="p-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredList.length > 0 ? (
                filteredList.map((item, idx) => {
                  const isVisible = showPasswordMap[item.id] || false;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00a54f] flex items-center justify-center">
                            <ShieldCheck size={16} />
                          </div>
                          <span className="font-bold text-slate-850">{item.username}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-550">{item.email}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">
                            {isVisible ? item.password : "••••••••"}
                          </span>
                          <button
                            onClick={() => toggleTablePassword(item.id)}
                            className="p-1 hover:bg-slate-100 text-slate-450 hover:text-slate-700 rounded transition-colors cursor-pointer"
                            title={isVisible ? "Sembunyikan" : "Tampilkan"}
                          >
                            {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
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
                            onClick={() => handleDelete(item.id, item.username)}
                            title="Hapus"
                            className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold text-sm">
                    Tidak ditemukan data user admin.
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
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? "Edit User Admin" : "Tambah User Admin"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: admin_tegal"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

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
                  placeholder="admin@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Password {editingId ? "(Kosongkan jika tidak diubah)" : "*"}
                </label>
                <div className="relative">
                  <input
                    type={showFormPassword ? "text" : "password"}
                    required={!editingId}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={editingId ? "Biarkan kosong untuk mempertahankan" : "Minimal 8 karakter"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showFormPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
