import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, QrCode } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/votes/submit`, { cart });
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/leaderboard");
        }, 5000);
      }
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
      alert("Terjadi kesalahan saat memproses pembayaran. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-md">
          <p className="text-slate-500 font-bold mb-4">Keranjang kosong atau Anda mengakses halaman ini secara tidak sah.</p>
          <Button label="Kembali ke Catalog" variant="primary" onClick={() => navigate("/catalogvote")} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20 pt-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-6 transition-colors w-fit"
          disabled={loading || success}
        >
          <ArrowLeft size={20} /> Kembali ke Keranjang
        </button>

        {success ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-12 text-center flex flex-col items-center gap-5">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">Pembayaran Berhasil!</h1>
            <p className="text-slate-500 max-w-sm">
              Terima kasih! Dukungan suara Anda telah masuk ke database dan akan langsung dihitung. Anda akan dialihkan ke Leaderboard...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Selesaikan <span className="text-emerald-600">Pembayaran</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* KIRI: QR CODE SCAN */}
              <Card className="p-6 text-center border-slate-200 flex flex-col items-center">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-widest mb-4">
                  <QrCode size={14} /> Scan QRIS
                </div>
                
                <p className="text-xs text-slate-500 mb-6 font-medium">
                  Scan kode QR di bawah menggunakan aplikasi e-wallet (GoPay, OVO, Dana, LinkAja) atau Mobile Banking Anda.
                </p>

                {/* QR Code Container */}
                <div className="bg-white p-4 border-2 border-slate-200 rounded-2xl shadow-inner mb-6 relative group overflow-hidden">
                  <img 
                    src="https://via.placeholder.com/300x300.png?text=QRIS+FORBASI+VOTE" 
                    alt="QRIS QR Code" 
                    className="w-56 h-56 object-contain"
                  />
                  <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                <div className="w-full">
                  <Button 
                    label={loading ? "Memproses..." : "SIMULASIKAN PEMBAYARAN BERHASIL"} 
                    variant="primary" 
                    onClick={handleSimulatePayment}
                    className="w-full py-4 text-xs tracking-wider shadow-lg shadow-emerald-100"
                    disabled={loading}
                  />
                </div>
              </Card>

              {/* KANAN: RINGKASAN ORDER */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6">
                  <h3 className="font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 text-lg">
                    Rincian Pembelian
                  </h3>
                  
                  <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1 mb-6">
                    {cart.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-start text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-slate-500 font-medium">{item.qty} Vote x IDR {item.price.toLocaleString("id-ID")}</p>
                        </div>
                        <p className="font-black text-emerald-600">IDR {(item.qty * item.price).toLocaleString("id-ID")}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-dashed border-slate-200 pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Metode</span>
                      <span className="font-bold text-slate-800 text-sm">QRIS Otomatis</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-slate-600">Total Tagihan</span>
                      <span className="font-black text-emerald-600 text-xl">IDR {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed font-medium">
                  ⚠️ <strong>Catatan Demo:</strong> Halaman ini mensimulasikan gerbang pembayaran QRIS nyata. Menekan tombol simulasi di samping kiri akan memicu database merekam transaksi vote tanpa memotong saldo/uang sungguhan.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
