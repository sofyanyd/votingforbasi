import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";

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

  // Data Dummy Peserta
  const participants: Participant[] = [
    { id: 1, name: "SMPN 10 TEGAL", subName: "PASPRADIPA WIRASENA", price: 1000, imageUrl: "https://via.placeholder.com/300x300.png?text=SMPN+10" },
    { id: 2, name: "SMPN 3 SEMARANG", subName: "PASKIBRA SATRIA", price: 1000, imageUrl: "https://via.placeholder.com/300x300.png?text=SMPN+3" },
    { id: 3, name: "SMPN 2 TEGAL", subName: "BHAYANGKARA", price: 1000, imageUrl: "https://via.placeholder.com/300x300.png?text=SMPN+2" },
    { id: 4, name: "SMAN 1 SLAWI", subName: "PASGASSUS", price: 1000, imageUrl: "https://via.placeholder.com/300x300.png?text=SMAN+1" },
  ];

  // State Keranjang (Cart)
  const [cart, setCart] = useState<any[]>([]);

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
    <div className="bg-gray-50 min-h-screen font-sans pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-6 transition-colors w-fit"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ── KIRI: KATALOG PESERTA (PRODUK) ── */}
          <div className="flex-1 w-full">
            <h1 className="text-2xl font-black text-gray-900 mb-6">Pilih Pleton Finalis</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {participants.map((p) => {
                const qty = getQty(p.id);
                return (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover" />
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-gray-900 truncate">{p.name}</h3>
                      <p className="text-xs text-gray-500 truncate mb-3">{p.subName}</p>
                      
                      <p className="font-black text-blue-600 mb-4">IDR {p.price.toLocaleString("id-ID")}</p>

                      {/* Kontrol Kuantitas Model E-Commerce */}
                      <div className="mt-auto">
                        {qty === 0 ? (
                          <button 
                            onClick={() => handleUpdateQty(p, 1)}
                            className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm border border-blue-100"
                          >
                            + Tambah Vote
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-1 border border-blue-100">
                            <button 
                              onClick={() => handleUpdateQty(p, -1)}
                              className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-600 shadow-sm hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-bold text-blue-800">{qty}</span>
                            <button 
                              onClick={() => handleUpdateQty(p, 1)}
                              className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-sm hover:bg-blue-700"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── KANAN: KERANJANG VOTE (STICKY) ── */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24 overflow-hidden">
              <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
                <ShoppingCart size={20} />
                <h3 className="font-bold">Keranjang Vote</h3>
              </div>

              <div className="p-5">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">Keranjang masih kosong.<br/>Pilih peserta di samping.</p>
                ) : (
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-sm border-b border-gray-50 pb-3">
                        <div>
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-gray-500">{item.qty} x IDR {item.price}</p>
                        </div>
                        <p className="font-bold text-blue-600">IDR {(item.qty * item.price).toLocaleString("id-ID")}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-600">Total Harga</span>
                    <span className="font-black text-blue-600 text-xl">IDR {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <button 
                  disabled={cart.length === 0}
                  onClick={() => navigate("/voting/checkout", { state: { cart, totalPrice } })}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    cart.length > 0 ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Lanjut Pembayaran
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}