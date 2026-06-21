import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useCategoryStore } from "../../../stores/categoryStore"; // Import store

interface CategoryFormInputs {
  nama: string;
}

export default function CategoryCreate() {
  const navigate = useNavigate();
  const { addCategory } = useCategoryStore(); // Ambil fungsi POST dari store
  
  const { register: login, handleSubmit, formState: { errors } } = useForm<CategoryFormInputs>();

  const onSubmit = async (data: CategoryFormInputs) => {
    const success = await addCategory(data);
    if (success) {
      alert("Kategori baru berhasil ditambahkan.");
      navigate("/dashboard/category"); // Kembali ke halaman utama kategori
    } else {
      alert("Gagal menambahkan kategori.");
    }
  };

  return (
    <div className="px-10 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#7B1D3F] mb-8 text-left">Tambah Kategori</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        {/* Name diubah menjadi nama agar sesuai skema database */}
        <Input 
          label="Nama Kategori" 
          name="nama" 
          register={login} 
          error={errors.nama?.message as string} 
        />
        
        <div className="flex justify-end gap-3 pt-4">
          {/* Rute disesuaikan dengan App.tsx (/dashboard/category) */}
          <Button label="Batal" variant="outline" onClick={() => navigate("/dashboard/category")} />
          <Button label="Simpan Kategori" type="submit" />
        </div>
      </form>
    </div>
  );
}