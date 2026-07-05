import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import { useQrCodeStore, type QrCode } from "../../../stores/useQrCodeStore";
import { 
  Coins, 
  Download, 
  Search, 
  Vote,
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  FileText
} from "lucide-react";

// Tipe Data Transaksi Voting
interface VoteTransaction {
  id: string;
  date: string;
  namaKlub: string;
  voterEmail: string;
  votesCount: number;
  amount: number;
  kodeUnik?: number;
  grandTotal?: number;
  status: string;
}

export default function FinanceIndex() {
  const { qrList, addQrCode, updateQrCode, deleteQrCode, fetchQrCodes } = useQrCodeStore();

  const [transactions, setTransactions] = useState<VoteTransaction[]>([]);
  const [pletonList, setPletonList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Detail Laporan" | "Histori Transaksi" | "Kelola QR Code">("Dashboard");
  
  // Filters State
  const [selectedMonth, setSelectedMonth] = useState("Semua");
  const [search, setSearch] = useState("");

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "loading" | "error" | null }>({
    message: "",
    type: null,
  });

  // QR Code Modal CRUD Form State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [editingQrId, setEditingQrId] = useState<string | null>(null);
  const [qrName, setQrName] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [qrImagePreview, setQrImagePreview] = useState("");
  const [qrDescription, setQrDescription] = useState("");
  const [qrStatus, setQrStatus] = useState<"Aktif" | "Non-Aktif">("Aktif");

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [txRes, speakerRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/votes/transactions`),
          axios.get(`${API_BASE_URL}/speakers`),
          fetchQrCodes()
        ]);
        setTransactions(txRes.data);
        setPletonList(speakerRes.data);
      } catch (error) {
        console.error("Gagal memuat data keuangan dari database:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Inject beautiful Google Font dynamically on component mount
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleApproveManual = async (transactionCode: string) => {
    if (!window.confirm("Apakah Anda yakin ingin memverifikasi transaksi pembayaran manual ini secara manual?")) {
      return;
    }
    
    showToast("Memproses verifikasi pembayaran...", "loading");
    try {
      await axios.post(`${API_BASE_URL}/votes/finalize-payment`, { transactionCode });
      showToast("Pembayaran berhasil diverifikasi secara manual! Suara vote telah masuk ke sistem.", "success");
      
      // Refresh transactions and pletons list
      const [txRes, speakersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/votes/transactions`),
        axios.get(`${API_BASE_URL}/speakers`)
      ]);
      setTransactions(txRes.data);
      setPletonList(speakersRes.data);
    } catch (error: any) {
      console.error("Gagal melakukan verifikasi manual:", error);
      showToast(error.response?.data?.message || "Gagal memverifikasi transaksi secara manual", "error");
    }
  };

  const handleDeleteTransaction = async (transactionCode: string, status: string) => {
    const confirmMessage = status === "Lunas"
      ? `⚠️ PERINGATAN: Transaksi ini berstatus LUNAS. Menghapus transaksi ini akan membatalkan pembayaran dan MENGHAPUS/MENGURANGI suara (vote) yang telah masuk ke pleton terkait.\n\nApakah Anda yakin ingin menghapus transaksi ini?`
      : `Apakah Anda yakin ingin menghapus transaksi pending ini?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    showToast("Menghapus transaksi...", "loading");
    try {
      await axios.delete(`${API_BASE_URL}/votes/transactions/${transactionCode}`);
      showToast("Transaksi dan suara terkait berhasil dihapus!", "success");

      // Refresh transactions and pletons list
      const [txRes, speakersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/votes/transactions`),
        axios.get(`${API_BASE_URL}/speakers`)
      ]);
      setTransactions(txRes.data);
      setPletonList(speakersRes.data);
    } catch (error: any) {
      console.error("Gagal menghapus transaksi:", error);
      showToast(error.response?.data?.message || "Gagal menghapus transaksi", "error");
    }
  };

  // Helper to parse bidang string "No. {noUrut} - {sekolah}"
  const parseBidang = (bidang: string) => {
    let noUrutParsed = "01";
    let sekolahParsed = bidang;
    if (bidang.startsWith("No. ") && bidang.includes(" - ")) {
      const parts = bidang.substring(4).split(" - ");
      noUrutParsed = parts[0].trim();
      sekolahParsed = parts.slice(1).join(" - ").trim();
    }
    return { noUrut: noUrutParsed, sekolah: sekolahParsed };
  };

  // Format IDR Currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("Rp", "Rp ");
  };

  const showToast = (message: string, type: "success" | "loading" | "error") => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => setToast({ message: "", type: null }), 3000);
    }
  };

  // Filtered Transactions for History Log
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.namaKlub.toLowerCase().includes(search.toLowerCase()) ||
      tx.voterEmail.toLowerCase().includes(search.toLowerCase());

    const matchesMonth =
      selectedMonth === "Semua" ||
      (selectedMonth === "Juni" && tx.date.includes("Juni")) ||
      (selectedMonth === "Mei" && tx.date.includes("Mei"));

    return matchesSearch && matchesMonth;
  });

  // Filtered QR List for Search
  const filteredQrList = qrList.filter((qr) => {
    return (
      qr.name.toLowerCase().includes(search.toLowerCase()) ||
      qr.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Calculations for Stats (only sum successful "Lunas" transactions)
  const totalKeuangan = filteredTransactions
    .filter((tx) => tx.status === "Lunas")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalVotes = filteredTransactions
    .filter((tx) => tx.status === "Lunas")
    .reduce((sum, tx) => sum + tx.votesCount, 0);

  // Aggregate member reports based on filtered success transactions
  const memberReport = pletonList.map((pleton) => {
    const clubVotes = filteredTransactions
      .filter((tx) => tx.status === "Lunas" && tx.namaKlub.toLowerCase() === pleton.nama.toLowerCase())
      .reduce((sum, tx) => sum + tx.votesCount, 0);

    const { sekolah } = parseBidang(pleton.bidang);

    return {
      name: pleton.nama,
      school: sekolah,
      votes: clubVotes,
      amount: clubVotes * 5000,
      status: "Aktif",
    };
  });

  // Sort descending by votes to assign dynamic ranks
  const sortedReport = [...memberReport].sort((a, b) => b.votes - a.votes);

  // Export to CSV
  const handleExportExcel = () => {
    showToast("Mengekspor data ke Excel...", "loading");

    setTimeout(() => {
      let csvContent = "";
      let filename = "";

      if (activeTab === "Detail Laporan") {
        filename = `Laporan_Voting_Anggota_${new Date().toISOString().slice(0,10)}.csv`;
        const headers = ["Rank", "Nama Klub", "Afiliasi Sekolah", "Jumlah Voting", "Total Transaksi", "Status"];
        const rows = sortedReport.map((item, idx) => [
          idx + 1,
          item.name,
          item.school,
          item.votes,
          formatCurrency(item.amount),
          item.status,
        ]);
        csvContent = [
          headers.join(","),
          ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")),
        ].join("\n");
      } else if (activeTab === "Kelola QR Code") {
        filename = `Daftar_Payment_QR_${new Date().toISOString().slice(0,10)}.csv`;
        const headers = ["ID", "Nama QR", "Deskripsi", "Status"];
        const rows = qrList.map((qr) => [
          qr.id,
          qr.name,
          qr.description,
          qr.status,
        ]);
        csvContent = [
          headers.join(","),
          ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")),
        ].join("\n");
      } else {
        filename = `Riwayat_Transaksi_Voting_${new Date().toISOString().slice(0,10)}.csv`;
        const headers = ["ID Transaksi", "Tanggal", "Nama Klub", "Voter Email", "Jumlah Voting", "Total Transaksi", "Status"];
        const rows = filteredTransactions.map((tx) => [
          tx.id,
          tx.date,
          tx.namaKlub,
          tx.voterEmail,
          tx.votesCount,
          formatCurrency(tx.amount),
          tx.status,
        ]);
        csvContent = [
          headers.join(","),
          ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")),
        ].join("\n");
      }

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("File Excel/CSV berhasil diunduh!", "success");
    }, 1000);
  };

  // QR Code Image File Upload Reader
  const handleQrPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran QR Code maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setQrImage(result);
        setQrImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Modal for QR Code Creation/Edition
  const openQrModal = (qr?: QrCode) => {
    if (qr) {
      setEditingQrId(String(qr.id));
      setQrName(qr.name);
      setQrImage(qr.image);
      setQrImagePreview(qr.image);
      setQrDescription(qr.description);
      setQrStatus(qr.status as "Aktif" | "Non-Aktif");
    } else {
      setEditingQrId(null);
      setQrName("");
      setQrImage("");
      setQrImagePreview("");
      setQrDescription("");
      setQrStatus("Aktif");
    }
    setIsQrModalOpen(true);
  };

  // Submit QR Code Form
  const handleQrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!qrName.trim() || !qrDescription.trim()) {
      alert("Nama dan Deskripsi wajib diisi!");
      return;
    }

    // Default mock QR svg if none uploaded
    const mockQrSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23f8fafc"/><rect x="10" y="10" width="25" height="25" fill="%230f172a" stroke="%23ffffff" stroke-width="2"/><rect x="65" y="10" width="25" height="25" fill="%230f172a" stroke="%23ffffff" stroke-width="2"/><rect x="10" y="65" width="25" height="25" fill="%230f172a" stroke="%23ffffff" stroke-width="2"/><rect x="15" y="15" width="15" height="15" fill="%23ffffff"/><rect x="70" y="15" width="15" height="15" fill="%23ffffff"/><rect x="15" y="70" width="15" height="15" fill="%23ffffff"/><rect x="19" y="19" width="7" height="7" fill="%230f172a"/><rect x="74" y="19" width="7" height="7" fill="%230f172a"/><rect x="19" y="74" width="7" height="7" fill="%230f172a"/><rect x="45" y="45" width="10" height="10" fill="%230f172a"/><rect x="45" y="20" width="8" height="8" fill="%230f172a"/><rect x="20" y="45" width="8" height="8" fill="%230f172a"/><rect x="65" y="45" width="12" height="12" fill="%230f172a"/><rect x="45" y="65" width="12" height="12" fill="%230f172a"/><rect x="65" y="65" width="20" height="20" fill="%230f172a"/><rect x="80" y="45" width="10" height="10" fill="%230f172a"/></svg>`;
    const finalImage = qrImage || mockQrSvg;

    const payload = {
      name: qrName.trim(),
      image: finalImage,
      description: qrDescription.trim(),
      status: qrStatus,
    };

    showToast("Menyimpan QR Code...", "loading");
    try {
      if (editingQrId) {
        await updateQrCode(editingQrId, payload);
        showToast("QR Code berhasil diperbarui!", "success");
      } else {
        await addQrCode(payload);
        showToast("QR Code berhasil ditambahkan!", "success");
      }
      setIsQrModalOpen(false);
    } catch (error) {
      showToast("Gagal menyimpan QR Code.", "error");
    }
  };

  // Delete QR Code
  const handleQrDelete = async (id: string | number, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus QR Code "${name}"?`)) {
      showToast("Menghapus QR Code...", "loading");
      try {
        await deleteQrCode(id);
        showToast("QR Code berhasil dihapus!", "success");
      } catch (error) {
        showToast("Gagal menghapus QR Code.", "error");
      }
    }
  };

  return (
    <div
      className="w-full bg-[#f8fafc] rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8 space-y-8 text-slate-800 transition-all duration-300"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Toast Notification */}
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

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-extrabold text-[#00a54f]">Keuangan & Voting Forbasi</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Pantau total keuangan, histori detail transaksi voting (Rp 5.000 / suara) dan kelola QR Code pembayaran</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {activeTab === "Kelola QR Code" && (
            <button
              onClick={() => openQrModal()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 bg-[#00a54f] hover:bg-[#008f44] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <Plus size={16} />
              Tambah QR Code
            </button>
          )}
          <button
            onClick={handleExportExcel}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-emerald-200 hover:border-emerald-500 text-emerald-600 hover:bg-emerald-50/20 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Download size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {/* 2. Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Keuangan Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shrink-0">
            <Coins size={22} />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight">{formatCurrency(totalKeuangan)}</div>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">Total Keuangan</div>
          </div>
        </div>

        {/* Total Voting Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0">
            <Vote size={22} />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight">{totalVotes.toLocaleString("id-ID")}</div>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">Total Voting Masuk</div>
          </div>
        </div>

        {/* Jumlah Transaksi Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-650 rounded-2xl flex items-center justify-center text-white shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight">
              {filteredTransactions.filter((tx) => tx.status === "Lunas").length}
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">Total Transaksi Lunas</div>
          </div>
        </div>
      </div>

      {/* 3. Filters Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/40 p-4 rounded-2xl border border-slate-100">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "Kelola QR Code" ? "Cari QR Code..." : "Cari ID, klub, atau email..."}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
          <Search size={18} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Month Filter */}
        <div className="relative">
          <select
            value={selectedMonth}
            disabled={activeTab === "Kelola QR Code"}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="Semua">Semua Bulan</option>
            <option value="Juni">Juni 2026</option>
            <option value="Mei">Mei 2026</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-slate-100">
        {[
          { key: "Dashboard", label: "Dashboard Ringkasan" },
          { key: "Detail Laporan", label: "Detail Laporan Pleton" },
          { key: "Histori Transaksi", label: "Histori Transaksi" },
          { key: "Kelola QR Code", label: "Kelola QR Code" }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/15"
                  : "bg-white border border-slate-150 text-slate-600 hover:text-slate-900 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Switcher Body: Dashboard */}
      {activeTab === "Dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Voting Tertinggi Leaderboard Mini */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.05)] p-6 lg:col-span-2">
            <div className="pb-4 border-b border-slate-50 flex justify-between items-center">
              <span className="font-bold text-slate-800 text-sm">Peringkat Suara Terbanyak (Top 3)</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {sortedReport.slice(0, 3).map((club, idx) => (
                <div
                  key={club.name}
                  className="flex items-center justify-between p-4 bg-emerald-50/20 hover:bg-emerald-50/40 border border-emerald-500/5 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm ${
                      idx === 0 ? "bg-yellow-100 text-yellow-800" :
                      idx === 1 ? "bg-slate-200 text-slate-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{club.name}</div>
                      <div className="text-xs font-semibold text-slate-450">{club.school}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-600">{club.votes} suara</div>
                    <div className="text-xs text-slate-400 mt-0.5">{formatCurrency(club.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informasi Panduan Voting */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.05)] p-6">
            <div className="pb-4 border-b border-slate-50">
              <span className="font-bold text-slate-800 text-sm">Informasi Voting</span>
            </div>
            
            <div className="mt-4 space-y-4 text-xs font-semibold text-slate-600">
              <div className="p-3 bg-indigo-50/50 text-indigo-700 rounded-2xl border border-indigo-100/50">
                <span className="block font-bold mb-0.5 text-indigo-800">Nominal Per Suara</span>
                Rp 5.000,- per 1 vote dukungan untuk finalis jagoan.
              </div>

              <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl border border-slate-200/50">
                <span className="block font-bold mb-0.5 text-slate-700">QR Code Pembayaran</span>
                Dikelola secara langsung oleh admin untuk memudahkan proses checkout di halaman pelanggan.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switcher Body: Detail Laporan */}
      {activeTab === "Detail Laporan" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Detail Laporan Hasil Voting Pleton</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Daftar lengkap perolehan suara voting dan akumulasi transaksi keuangan Rp 5.000 per suara.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">Rank</th>
                  <th className="p-4">Nama Pleton</th>
                  <th className="p-4 hidden sm:table-cell">Afiliasi Sekolah</th>
                  <th className="p-4 text-center">Jumlah Voting</th>
                  <th className="p-4 text-right">Total Transaksi</th>
                  <th className="p-4 text-center hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        Memuat data pleton...
                      </div>
                    </td>
                  </tr>
                ) : sortedReport.length > 0 ? (
                  sortedReport.map((club, idx) => (
                    <tr key={club.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-center">
                        <span className={`inline-flex w-6 h-6 items-center justify-center rounded-lg font-bold ${
                          idx === 0 
                            ? "bg-yellow-100 text-yellow-800" 
                            : idx === 1 
                            ? "bg-slate-200 text-slate-800" 
                            : idx === 2 
                            ? "bg-amber-100 text-amber-800" 
                            : "bg-slate-50 text-slate-500"
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        <div>{club.name}</div>
                        <div className="sm:hidden text-[10px] text-slate-450 font-semibold mt-0.5">{club.school}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-500 hidden sm:table-cell">{club.school}</td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-extrabold text-[11px]">
                          {club.votes.toLocaleString("id-ID")} Suara
                        </span>
                      </td>
                      <td className="p-4 text-right font-extrabold text-slate-800">{formatCurrency(club.amount)}</td>
                      <td className="p-4 text-center hidden md:table-cell">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          club.status === "Aktif" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : club.status === "Pending" 
                            ? "bg-amber-50 text-amber-700" 
                            : "bg-red-50 text-red-700"
                        }`}>
                          {club.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold text-sm">Tidak ada data pleton.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Switcher Body: Histori Transaksi */}
      {activeTab === "Histori Transaksi" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Aktivitas Histori Detail Transaksi</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Semua log transaksi masuk dari voting digital jagoan peserta Kota Tegal.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">ID Transaksi</th>
                  <th className="p-4 hidden sm:table-cell">Tanggal</th>
                  <th className="p-4">Nama Pleton</th>
                  <th className="p-4 hidden md:table-cell">Email Pembeli</th>
                  <th className="p-4 text-center">Jumlah Voting</th>
                  <th className="p-4 text-right">Total Transaksi</th>
                  <th className="p-4 text-center hidden sm:table-cell">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        Memuat data transaksi...
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-indigo-650">{tx.id}</td>
                      <td className="p-4 text-slate-400 hidden sm:table-cell">{tx.date}</td>
                      <td className="p-4 font-bold text-slate-800">
                        <div>{tx.namaKlub}</div>
                        <div className="sm:hidden text-[10px] text-slate-400 font-semibold mt-0.5">{tx.date}</div>
                        <div className="md:hidden text-[10px] text-slate-500 font-semibold truncate max-w-[150px]">{tx.voterEmail}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-500 hidden md:table-cell">{tx.voterEmail}</td>
                      <td className="p-4 text-center font-bold text-slate-750">{tx.votesCount} Suara</td>
                      <td className="p-4 text-right font-extrabold text-slate-900">{formatCurrency(tx.amount)}</td>
                      <td className="p-4 text-center hidden sm:table-cell">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          tx.status === "Lunas" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : tx.status === "Pending" 
                            ? "bg-amber-50 text-amber-700" 
                            : tx.status === "Batal"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-50 text-slate-700"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {tx.status === "Pending" && (
                            <button
                              onClick={() => handleApproveManual(tx.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                            >
                              ACC
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTransaction(tx.id, tx.status)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                            title="Hapus Transaksi"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold text-sm">Tidak ditemukan data transaksi yang cocok.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Switcher Body: Kelola QR Code */}
      {activeTab === "Kelola QR Code" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Kelola QR Code Pembayaran</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Atur QR Code Qris/Transfer Bank untuk ditampilkan pada halaman voting pelanggan.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">No</th>
                  <th className="p-4 w-16">Preview</th>
                  <th className="p-4 w-48">Nama QR Code</th>
                  <th className="p-4">Deskripsi/Detail Akun</th>
                  <th className="p-4 w-28 text-center">Status</th>
                  <th className="p-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredQrList.length > 0 ? (
                  filteredQrList.map((qr, idx) => (
                    <tr key={qr.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                          <img src={qr.image} alt={qr.name} className="w-full h-full object-contain" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-800">{qr.name}</td>
                      <td className="p-4 text-slate-500 font-semibold text-xs leading-relaxed">{qr.description}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                          qr.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {qr.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openQrModal(qr)}
                            title="Edit"
                            className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-400 transition-colors cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleQrDelete(qr.id, qr.name)}
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
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold text-sm">Tidak ditemukan data QR Code yang cocok.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Code CRUD Modal Form */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">
                {editingQrId ? "Edit QR Code" : "Tambah QR Code"}
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleQrSubmit} className="p-6 space-y-4">
              {/* QR Image Selection */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0 relative">
                  {qrImagePreview ? (
                    <img src={qrImagePreview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="text-slate-300 w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="block text-[10px] font-bold text-slate-500 mb-1">QR CODE IMAGE</span>
                  <label className="inline-block py-1.5 px-3 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:border-emerald-500 hover:text-[#00a54f] cursor-pointer transition-colors shadow-sm">
                    Pilih Barcode QR
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrPhotoChange}
                      className="hidden"
                    />
                  </label>
                  <span className="block text-[9px] text-slate-400 mt-1">Format JPG/PNG, maks. 2MB.</span>
                </div>
              </div>

              {/* QR Code Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nama QR Code *
                </label>
                <input
                  type="text"
                  required
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                  placeholder="Contoh: QRIS DANA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Description / Detail */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Deskripsi / Detail Akun *
                </label>
                <textarea
                  required
                  rows={3}
                  value={qrDescription}
                  onChange={(e) => setQrDescription(e.target.value)}
                  placeholder="Contoh: Rekening BCA 809271827 a/n FORBASI TEGAL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Status QR Code *
                </label>
                <div className="relative">
                  <select
                    value={qrStatus}
                    onChange={(e) => setQrStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
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
                  onClick={() => setIsQrModalOpen(false)}
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
