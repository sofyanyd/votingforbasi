import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Button from "../components/ui/Button"; // Menggunakan komponen Button
import Card from "../components/ui/Card"; // Menggunakan komponen Card

// Tipe Data
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

    // Dynamically inject Midtrans Snap SDK (Sandbox environment)
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "Mid-client-Y-dzEI-RP3zwSNi5"); // Placeholder key
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [cart, setCart] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitVotes = async () => {
    setSubmitting(true);
    try {
      // 1. request payment Snap token from backend
      const response = await axios.post(`${API_BASE_URL}/votes/request-payment`, { cart });
      const { token, redirect_url, transactionCode, isMock } = response.data;

      // 2. If backend falls back to mock flow (MIDTRANS_SERVER_KEY is empty)
      if (isMock) {
        const simulate = window.confirm(
          "Kunci server Midtrans belum dipasang di backend (.env).\n" +
          "Apakah Anda ingin mensimulasikan Pembayaran Berhasil (Mode Demo)?"
        );
        if (simulate) {
          showToastMessage("Menghubungkan pembayaran simulasi...");
          await axios.post(`${API_BASE_URL}/votes/finalize-payment`, { transactionCode, cart });
          alert("Pembayaran Simulasi Berhasil! Vote Anda telah terekam.");
          setCart([]);
          navigate("/leaderboard");
        }
        return;
      }

      // 3. Open real Midtrans Snap checkout popup
      if ((window as any).snap) {
        (window as any).snap.pay(token, {
          onSuccess: async (result: any) => {
            console.log("Midtrans payment success:", result);
            showToastMessage("Memverifikasi pembayaran...");
            await axios.post(`${API_BASE_URL}/votes/finalize-payment`, { transactionCode, cart });
            alert("Pembayaran Berhasil! Vote Anda telah terekam.");
            setCart([]);
            navigate("/leaderboard");
          },
          onPending: (result: any) => {
            console.log("Midtrans payment pending:", result);
            alert("Pembayaran tertunda. Silakan selesaikan pembayaran Anda di instruksi Midtrans.");
          },
          onError: (result: any) => {
            console.error("Midtrans payment error:", result);
            alert("Kesalahan pembayaran Midtrans. Silakan coba beberapa saat lagi.");
          },
          onClose: () => {
            console.log("Payment popup closed by customer");
          }
        });
      } else {
        // Fallback to hosted redirect page if Snap popup fails to load
        window.open(redirect_url, "_blank");
        const confirmPayment = window.confirm(
          "Halaman pembayaran Midtrans baru telah dibuka di tab baru.\n" +
          "Selesaikan pembayaran Anda di sana, lalu klik OK untuk memverifikasi."
        );
        if (confirmPayment) {
          showToastMessage("Memverifikasi pembayaran...");
          await axios.post(`${API_BASE_URL}/votes/finalize-payment`, { transactionCode, cart });
          alert("Pembayaran Berhasil! Vote Anda telah terekam.");
          setCart([]);
          navigate("/leaderboard");
        }
      }
    } catch (error) {
      console.error("Gagal memproses pembayaran voting:", error);
      alert("Gagal memproses pembayaran. Pastikan server backend Anda berjalan.");
    } finally {
      setSubmitting(false);
    }
  };

  const showToastMessage = (msg: string) => {
    console.log(msg);
  };


  // Fungsi untuk menambah/mengurangi qty dari tombol + dan - di card
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

  // Helper untuk mendapatkan QTY peserta tertentu dari cart
  const getQty = (id: number) => cart.find((item) => item.id === id)?.qty || 0;

  // Hitung Total
  const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-6 transition-colors w-fit"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ── KIRI: KATALOG PESERTA (PRODUK) ── */}
          <div className="flex-1 w-full">
            <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              Pilih Pleton <span className="text-emerald-600">Finalis</span>
            </h1>
            
            {loading ? (
              <div className="text-center py-12 text-slate-500 font-semibold bg-white rounded-3xl border border-slate-200 shadow-sm">
                Sedang memuat data pleton peserta...
              </div>
            ) : participants.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-3xl border border-slate-200 shadow-sm">
                Belum ada data pleton peserta yang tersedia.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {participants.map((p) => {
                  const qty = getQty(p.id);
                  return (
                    // Menggunakan Komponen Card
                    <Card key={p.id} className="p-0 flex flex-col h-full border-slate-200 group">
                      <div className="relative overflow-hidden">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-slate-900 truncate">{p.name}</h3>
                        <p className="text-xs text-slate-500 truncate mb-3 font-medium">{p.subName}</p>
                        
                        <p className="font-black text-emerald-600 mb-5">IDR {p.price.toLocaleString("id-ID")}</p>

                        {/* Kontrol Kuantitas Model E-Commerce */}
                        <div className="mt-auto">
                          {qty === 0 ? (
                            <Button 
                              variant="outline"
                              onClick={() => handleUpdateQty(p, 1)}
                              className="w-full py-2.5 text-sm border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                            >
                              + Tambah Vote
                            </Button>
                          ) : (
                            <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-1.5 border border-emerald-100 shadow-inner">
                              <button 
                                onClick={() => handleUpdateQty(p, -1)}
                                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-100 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-black text-emerald-800">{qty}</span>
                              <button 
                                onClick={() => handleUpdateQty(p, 1)}
                                className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm hover:bg-emerald-700 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── KANAN: KERANJANG VOTE (STICKY) ── */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 sticky top-24 overflow-hidden">
              <div className="bg-emerald-600 p-5 text-white flex items-center gap-3">
                <ShoppingCart size={20} />
                <h3 className="font-bold text-lg">Keranjang Vote</h3>
              </div>

              <div className="p-6">
                {cart.length === 0 ? (
                  <div className="text-center text-slate-400 py-10 flex flex-col items-center gap-3">
                    <ShoppingCart size={40} className="text-slate-200" />
                    <p className="text-sm">Keranjang masih kosong.<br/>Pilih peserta di samping.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-sm border-b border-slate-100 pb-4">
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-slate-500 font-medium">{item.qty} x IDR {item.price}</p>
                        </div>
                        <p className="font-black text-emerald-600">IDR {(item.qty * item.price).toLocaleString("id-ID")}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t-2 border-dashed border-slate-200 pt-5 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-500">Total Harga</span>
                    <span className="font-black text-emerald-600 text-2xl">IDR {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                 <button 
                  disabled={cart.length === 0 || submitting}
                  onClick={handleSubmitVotes}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 cursor-pointer ${
                    cart.length > 0 ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "Mengirim Vote..." : "Kirim Vote Sekarang"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}