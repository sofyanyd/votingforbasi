import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useEventStore } from "../../../stores/eventStore";
import { useCategoryStore } from "../../../stores/categoryStore"; 
import { usePembicaraStore } from "../../../stores/PembicaraStore"; 

interface EventFormInputs {
  nama: string;
  lokasi: string;
  tanggal: string;
  deskripsi: string;
  categoryId: number;
  pembicaraId: number;
}

export default function EventCreate() {
  const navigate = useNavigate();
  const { addEvent } = useEventStore();
  
  const { categories, fetchCategories } = useCategoryStore();
  const { pembicaraList, fetchPembicara } = usePembicaraStore();
  
  const { register: login, handleSubmit, formState: { errors } } = useForm<EventFormInputs>();

  // Membaca data asli dari database cloud saat halaman dimuat
  useEffect(() => {
    fetchCategories();
    fetchPembicara();
  }, [fetchCategories, fetchPembicara]); // <-- Typo sudah diperbaiki di sini

  const onSubmit = async (data: EventFormInputs) => {
    const payload = {
      ...data,
      categoryId: Number(data.categoryId),
      pembicaraId: Number(data.pembicaraId),
    };

    const success = await addEvent(payload);
    if (success) {
      alert("Event baru berhasil disimpan!");
      navigate("/dashboard/event");
    } else {
      alert("Gagal menambahkan event. Pastikan pilihan Kategori dan Pembicara sudah benar!");
    }
  };

  return (
    <div className="px-10 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#7B1D3F] mb-8 text-left">Tambah Event</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        
        {/* NAMA EVENT */}
        <Input 
          label="Nama Event" 
          name="nama" 
          register={login} 
          error={errors.nama?.message as string} 
        />

        {/* LOKASI */}
        <Input 
          label="Lokasi Event" 
          name="lokasi" 
          register={login} 
          error={errors.lokasi?.message as string} 
        />

        {/* TANGGAL */}
        <Input 
          label="Tanggal Acara" 
          name="tanggal" 
          type="datetime-local" 
          register={login} 
          error={errors.tanggal?.message as string} 
        />

        {/* DESKRIPSI */}
        <Input 
          label="Deskripsi (Opsional)" 
          name="deskripsi" 
          register={login} 
        />
        
        {/* CONTAINER PILIHAN DROP-DOWN */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* DROP-DOWN KATEGORI */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Kategori Event</label>
            <select 
              {...login("categoryId", { required: true })}
              className="w-full px-4 py-2 text-sm border border-gray-200 bg-white text-[#1a0a10] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1D3F] h-[42px] transition"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nama}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500">Wajib diisi</p>}
          </div>

          {/* DROP-DOWN PEMBICARA */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Pembicara</label>
            <select 
              {...login("pembicaraId", { required: true })}
              className="w-full px-4 py-2 text-sm border border-gray-200 bg-white text-[#1a0a10] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1D3F] h-[42px] transition"
            >
              <option value="">-- Pilih Pembicara --</option>
              {pembicaraList.map((pem) => (
                <option key={pem.id} value={pem.id}>
                  {pem.nama}
                </option>
              ))}
            </select>
            {errors.pembicaraId && <p className="text-xs text-red-500">Wajib diisi</p>}
          </div>

        </div>
        
        {/* TOMBOL AKSI */}
        <div className="flex justify-end gap-3 pt-4">
          <Button label="Batal" variant="outline" onClick={() => navigate("/dashboard/event")} />
          <Button label="Simpan Event" type="submit" />
        </div>
      </form>
    </div>
  );
}