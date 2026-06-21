import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useCategoryStore } from "../../../stores/categoryStore";

interface CategoryFormInputs {
  nama: string;
}

export default function CategoryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Ambil data categories, loading, fungsi update, dan fungsi fetch dari store
  const { categories, loading, updateCategory, fetchCategories } = useCategoryStore();
  
  const { register: login, handleSubmit, setValue, formState: { errors } } = useForm<CategoryFormInputs>();

  // PENGAMAN 1: Jika user langsung refresh di halaman edit, pastikan data categories di-fetch ulang agar tidak kosong
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  // PENGAMAN 2: Memuat data nama kategori lama ke dalam form input setelah data categories tersedia
  useEffect(() => {
    if (categories.length > 0) {
      const currentCategory = categories.find((c) => c.id === Number(id));
      if (currentCategory) {
        setValue("nama", currentCategory.nama);
      } else {
        // Jika ID tidak ditemukan di database, kembalikan ke index
        navigate("/dashboard/category");
      }
    }
  }, [id, categories, setValue, navigate]);

  const onSubmit = async (data: CategoryFormInputs) => {
    const success = await updateCategory(Number(id), data);
    if (success) {
      alert("Kategori berhasil diperbarui.");
      navigate("/dashboard/category");
    } else {
      alert("Gagal memperbarui kategori.");
    }
  };

  // PENGAMAN 3: Tampilkan loading text jika data categories sedang diambil dari backend, mencegah crash nyari ID undefined
  if (loading && categories.length === 0) {
    return (
      <div className="text-center py-20 text-sm text-gray-500">
        Sedang memuat data kategori lama...
      </div>
    );
  }

  return (
    <div className="px-10 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#7B1D3F] mb-8 text-left">Edit Kategori</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <Input 
          label="Nama Kategori" 
          name="nama" 
          register={login} 
          error={errors.nama?.message as string} 
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button label="Batal" variant="outline" onClick={() => navigate("/dashboard/category")} />
          <Button label="Perbarui Kategori" type="submit" />
        </div>
      </form>
    </div>
  );
}