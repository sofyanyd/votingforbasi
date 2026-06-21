import { useEffect } from "react";
import { useCategoryStore } from "../../stores/categoryStore";
import { useEventStore } from "../../stores/eventStore";
import { usePembicaraStore } from "../../stores/PembicaraStore";
import { LayoutGrid, CalendarDays, Users, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { categories, fetchCategories } = useCategoryStore();
  const { events, fetchEvents } = useEventStore();
  const { pembicaraList, fetchPembicara } = usePembicaraStore();

  useEffect(() => {
    fetchCategories();
    fetchEvents();
    fetchPembicara();
  }, [fetchCategories, fetchEvents, fetchPembicara]);

  // Statistik yang sudah disesuaikan (Event Aktif dihapus)
  const stats = [
    { title: "Kategori", value: categories.length, icon: LayoutGrid, color: "text-blue-600" },
    { title: "Total Event", value: events.length, icon: CalendarDays, color: "text-purple-600" },
    { title: "Pembicara", value: pembicaraList.length, icon: Users, color: "text-emerald-600" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-2 text-[#7B1D3F] tracking-tight">Dashboard</h1>
      <p className="mb-8 text-gray-500">Ringkasan performa dan data terbaru sistem Anda.</p>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((item) => (
          <div key={item.title} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">{item.title}</p>
              <p className="text-4xl font-bold text-gray-800">{item.value}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-gray-50 ${item.color}`}>
              <item.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* EVENT TERBARU */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-bold mb-6 text-[#7B1D3F] text-xl flex items-center gap-2">
            <CalendarDays size={20} /> Event Terbaru
          </h2>
          <ul className="space-y-5">
            {events.slice(-3).reverse().map((item) => (
              <li key={item.id} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">{item.nama}</p>
                  <p className="text-gray-400 text-sm">
                    {item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID", { dateStyle: 'long' }) : "-"}
                  </p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-[#7B1D3F]" />
              </li>
            ))}
          </ul>
        </div>

        {/* PEMBICARA TERBARU */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-bold mb-6 text-[#7B1D3F] text-xl flex items-center gap-2">
            <Users size={20} /> Pembicara Terbaru
          </h2>
          <ul className="space-y-5">
            {pembicaraList.slice(-3).reverse().map((item) => (
              <li key={item.id} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">{item.nama}</p>
                  <p className="text-gray-400 text-sm">{item.bidang}</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-[#7B1D3F]" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}