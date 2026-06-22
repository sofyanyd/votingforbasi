import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Info, ChevronUp } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Button from "../components/ui/Button";

interface Participant {
  id: number;
  name: string;
  subName: string;
  price: number;
  imageUrl: string;
}

export default function CatalogVote() {
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // State untuk toggle keranjang (Mobile)
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/speakers`);
        const mapped = response.data.map((item: any) => {
          let subName = item.bidang;
          if (item.bidang.includes(" - ")) {
            subName = item.bidang.split(" - ")[1];
          }
          return {
            id: item.id,
            name: item.nama,
            subName: subName,
            price: 2000,
            imageUrl: item.foto_url || `https://via.placeholder.com/300x300.png?text=${encodeURIComponent(item.nama)}`
          };
        });
        setParticipants(mapped);
      } catch (error) {
        console.error("Gagal mengambil data peserta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "Mid-client-Y-dzEI-RP3zwSNi5");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmitVotes = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/votes/request-payment`, { cart });
      const { token, redirect_url, transactionCode, isMock } = response.data;

      if (isMock) {
        const simulate = window.confirm(
          "Kunci server Midtrans belum dipasang di backend (.env).\n" +
          "Apakah Anda ingin mensimulasikan Pembayaran Berhasil?"
        );
        if (simulate) {
          console.log("Menghubungkan pembayaran simulasi...");
          await axios.post(`${API_BASE_URL}/votes/finalize-payment`, { transactionCode, cart });
          alert("Pembayaran Simulasi Berhasil! Vote Anda telah terekam.");
          setCart([]);
          navigate("/leaderboard");
        }
        return;
      }

      if ((window as any).snap) {
        (window as any).snap.pay(token, {
          onSuccess: async (result: any) => {
            console.log("Midtrans payment success:", result);
            await axios.post(`${API_BASE_URL}/votes/finalize-payment`, { transactionCode, cart });
            alert("Pembayaran Berhasil! Vote Anda telah terekam.");
            setCart([]);
            navigate("/leaderboard");
          },
          onPending: (result: any) => {
            console.log("Midtrans payment pending:", result);
            alert("Pembayaran tertunda. Silakan selesaikan instruksi Midtrans.");
          },
          onError: (result: any) => {
            console.error("Midtrans payment error:", result);
            alert("Kesalahan pembayaran Midtrans.");
          },
        });
      } else {
        window.open(redirect_url, "_blank");
      }
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
      alert("Gagal memproses pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateQty = (participant: Participant, delta: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === participant.id);
      if (existingItem) {
        const newQty = existingItem.qty + delta;
        if (newQty <= 0) return prevCart.filter((item) => item.id !== participant.id);
        return prevCart.map((item) => item.id === participant.id ? { ...item, qty: newQty } : item);
      } else if (delta > 0) {
        return [...prevCart, { id: participant.id, name: participant.name, price: participant.price, qty: 1 }];
      }
      return prevCart;
    });
  };

  const getQty = (id: number) => cart.find((item) => item.id === id)?.qty || 0;
  const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  return (
    // Di Mobile: min-h-screen (bisa scroll biasa). Di Desktop: Dikunci tinggi layarnya (h-[calc...])
    <div className="bg-slate-50 font-sans min-h-screen md:min-h-0 p-0 md:p-6 md:h-[calc(100vh-70px)] relative">
      
      {/* Container Utama */}
      <div className="flex flex-col md:flex-row w-full h-full bg-transparent md:bg-white md:rounded-3xl md:shadow-lg md:border border-slate-200 md:overflow-hidden">
        
        {/* ── KIRI: KATALOG PESERTA ── */}
        <div className="w-full md:w-2/3 lg:flex-1 h-full md:bg-slate-50 md:overflow-y-auto p-4 md:p-6 pb-32 md:pb-20">
          
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-4 md:mb-6 transition-colors w-fit text-sm md:text-base"
          >
            <ArrowLeft size={18} /> Kembali
          </button>

          <h1 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            Katalog <span className="text-emerald-600">Finalis</span>
          </h1>
          
          {loading ? (
            <div className="text-center py-10 text-slate-500 font-semibold bg-white rounded-xl border border-slate-200">
              Memuat data...
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium bg-white rounded-xl border border-slate-200">
              Katalog kosong.
            </div>
          ) : (
            // GRID: 2 kolom di HP, 3-4 kolom di Desktop
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {participants.map((p) => {
                const qty = getQty(p.id);
                return (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden group">
                    <div className="relative overflow-hidden bg-slate-100">
                      {/* Tinggi gambar yang pas untuk HP (h-32) dan Desktop (h-40) */}
                      <img src={p.imageUrl} alt={p.name} className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-slate-900 text-xs md:text-sm leading-tight line-clamp-2" title={p.name}>{p.name}</h3>
                      <p className="text-[10px] md:text-xs text-slate-500 truncate mt-1 font-medium">{p.subName}</p>
                      <p className="font-black text-emerald-600 text-sm mt-1 mb-3">Rp {p.price.toLocaleString("id-ID")}</p>

                      <div className="mt-auto">
                        {qty === 0 ? (
                          <Button 
                            variant="outline"
                            onClick={() => handleUpdateQty(p, 1)}
                            className="w-full py-2 text-xs md:text-sm border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          >
                            + Vote
                          </Button>
                        ) : (
                          <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-1 border border-emerald-100 shadow-inner">
                            <button 
                              onClick={() => handleUpdateQty(p, -1)}
                              className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-black text-emerald-800 text-xs md:text-sm">{qty}</span>
                            <button 
                              onClick={() => handleUpdateQty(p, 1)}
                              className="w-7 h-7 bg-emerald-600 rounded-md flex items-center justify-center text-white shadow-sm hover:bg-emerald-700"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── KANAN: KERANJANG VOTE (HANYA MUNCUL DI DESKTOP/TABLET) ── */}
        <div className="hidden md:flex w-1/3 lg:w-80 xl:w-96 h-full flex-col bg-white border-l border-slate-200 relative z-10">
          <div className="bg-emerald-600 p-5 text-white flex items-center gap-2">
            <ShoppingCart size={20} />
            <h3 className="font-bold text-lg tracking-wide">Keranjang</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-5 bg-white">
            {cart.length === 0 ? (
              <div className="text-center text-slate-300 py-10 flex flex-col items-center gap-2">
                <ShoppingCart size={40} />
                <p className="text-sm font-medium">Keranjang kosong.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</p>
                      <p className="text-slate-400 font-medium">{item.qty}x @ Rp{item.price}</p>
                    </div>
                    <p className="font-black text-emerald-600 text-sm whitespace-nowrap">
                      Rp {(item.qty * item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50 mt-auto">
            <div className="flex justify-between items-end mb-5">
              <span className="font-bold text-slate-500 text-sm">Total Tagihan</span>
              <span className="font-black text-emerald-600 text-xl leading-none">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <button 
              disabled={cart.length === 0 || submitting}
              onClick={handleSubmitVotes}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${
                cart.length > 0 ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {submitting ? "Tunggu..." : "Bayar Sekarang"}
            </button>
            
            <p className="flex text-slate-400 text-[10px] mt-3 justify-center items-center gap-1 font-medium">
               <Info size={12} /> Pembayaran aman via Midtrans
            </p>
          </div>
        </div>
      </div>

      {/* ── FLOAT BAR KERANJANG (HANYA MUNCUL DI HP JIKA ADA ITEM) ── */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-3xl transition-transform duration-300 ease-in-out">
          
          {/* Detail Expand Keranjang HP */}
          {isMobileCartOpen && (
            <div className="p-5 bg-slate-50 max-h-[40vh] overflow-y-auto rounded-t-3xl border-b border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm"><ShoppingCart size={16}/> Rincian Vote</h4>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
                    <div>
                      <p className="font-bold text-slate-700">{item.name}</p>
                      <p className="text-slate-500">{item.qty} x Rp {item.price}</p>
                    </div>
                    <p className="font-black text-emerald-600">Rp {(item.qty * item.price).toLocaleString("id-ID")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bar Utama HP */}
          <div className="p-4 px-6 flex items-center justify-between gap-4">
            <div 
              className="flex-1 flex flex-col justify-center cursor-pointer group"
              onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
            >
              <div className="flex items-center gap-1 text-slate-500 mb-0.5 group-hover:text-emerald-600 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-widest">Total Belanja</span>
                <ChevronUp size={14} className={`transform transition-transform ${isMobileCartOpen ? "rotate-180" : ""}`} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-emerald-600 text-xl leading-none">Rp {totalPrice.toLocaleString("id-ID")}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{totalItems} Tiket</span>
              </div>
            </div>

            <button 
              disabled={submitting}
              onClick={handleSubmitVotes}
              className="bg-emerald-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-200 whitespace-nowrap"
            >
              {submitting ? "Proses..." : "Bayar"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}