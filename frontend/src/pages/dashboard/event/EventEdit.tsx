import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useEventStore } from "../../../stores/eventStore";

interface EventFormInputs {
  nama: string;
  lokasi: string;
  tanggal: string;
  deskripsi: string;
  categoryId: number;
  pembicaraId: number;
}

export default function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, updateEvent } = useEventStore();
  
  const { register: login, handleSubmit, setValue, formState: { errors } } = useForm<EventFormInputs>();

  // Ambil data lama dari store berdasarkan ID dan masukkan ke dalam input form (Prefill)
  useEffect(() => {
    const currentEvent = events.find((e) => e.id === Number(id));
    if (currentEvent) {
      setValue("nama", currentEvent.nama);
      setValue("lokasi", currentEvent.lokasi);
      // Format tanggal ke bentuk YYYY-MM-DDTHH:MM agar sesuai dengan input datetime-local
      if (currentEvent.tanggal) {
        const formattedDate = new Date(currentEvent.tanggal).toISOString().slice(0, 16);
        setValue("tanggal", formattedDate);
      }
      setValue("deskripsi", currentEvent.deskripsi);
      setValue("categoryId", currentEvent.categoryId);
      setValue("pembicaraId", currentEvent.pembicaraId);
    } else {
      navigate("/dashboard/event");
    }
  }, [id, events, setValue, navigate]);

  const onSubmit = async (data: EventFormInputs) => {
    const payload = {
      ...data,
      categoryId: Number(data.categoryId),
      pembicaraId: Number(data.pembicaraId),
    };

    const success = await updateEvent(Number(id), payload);
    if (success) {
      alert("Data event berhasil diperbarui.");
      navigate("/dashboard/event");
    } else {
      alert("Gagal memperbarui data event. Periksa kembali input Anda.");
    }
  };

  return (
    <div className="px-10 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#7B1D3F] mb-8 text-left">Edit Event</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <Input 
          label="Nama Event" 
          name="nama" 
          register={login} 
          error={errors.nama?.message as string} 
        />

        <Input 
          label="Lokasi Event" 
          name="lokasi" 
          register={login} 
          error={errors.lokasi?.message as string} 
        />

        <Input 
          label="Tanggal Acara" 
          name="tanggal" 
          type="datetime-local" 
          register={login} 
          error={errors.tanggal?.message as string} 
        />

        <Input 
          label="Deskripsi (Opsional)" 
          name="deskripsi" 
          register={login} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="ID Kategori" 
            name="categoryId" 
            type="number"
            register={login} 
            error={errors.categoryId ? "Wajib diisi" : ""}
          />
          <Input 
            label="ID Pembicara" 
            name="pembicaraId" 
            type="number"
            register={login} 
            error={errors.pembicaraId ? "Wajib diisi" : ""}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button label="Batal" variant="outline" onClick={() => navigate("/dashboard/event")} />
          <Button label="Perbarui Event" type="submit" />
        </div>
      </form>
    </div>
  );
}