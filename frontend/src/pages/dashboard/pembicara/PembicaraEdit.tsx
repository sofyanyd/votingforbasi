import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
// Pastikan path ini benar sesuai file store kamu
import { usePembicaraStore } from "../../../stores/PembicaraStore"; 

interface PembicaraFormInputs {
  name: string;
  role: string;
  institution: string;
  email: string;
}

export default function PembicaraEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Gunakan state dan fungsi yang sesuai dengan PembicaraStore
  const { pembicaraList, loading, updatePembicara, fetchPembicara } = usePembicaraStore();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PembicaraFormInputs>();

  useEffect(() => {
    if (pembicaraList.length === 0) {
      fetchPembicara();
    }
  }, [pembicaraList, fetchPembicara]);

  useEffect(() => {
    if (pembicaraList.length > 0) {
      const currentPembicara = pembicaraList.find((s) => s.id === Number(id));
      if (currentPembicara) {
        setValue("name", currentPembicara.nama);
        setValue("email", currentPembicara.email);
        
        if (currentPembicara.bidang.includes(" di ")) {
          const [role, institution] = currentPembicara.bidang.split(" di ");
          setValue("role", role);
          setValue("institution", institution);
        } else {
          setValue("role", currentPembicara.bidang);
          setValue("institution", "");
        }
      } else {
        navigate("/dashboard/pembicara"); // Redirect jika ID tidak ditemukan
      }
    }
  }, [id, pembicaraList, setValue, navigate]);

  const onSubmit = async (data: PembicaraFormInputs) => {
    const payload = {
      nama: data.name,
      bidang: `${data.role} di ${data.institution}`,
      email: data.email
    };

    const success = await updatePembicara(Number(id), payload);
    if (success) {
      alert("Data pembicara berhasil diperbarui.");
      navigate("/dashboard/pembicara"); // Path rute yang benar
    } else {
      alert("Gagal memperbarui data pembicara.");
    }
  };

  if (loading && pembicaraList.length === 0) {
    return <div className="text-center py-20 text-sm text-gray-500">Memuat data...</div>;
  }

  return (
    <div className="px-10 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#7B1D3F] mb-8 text-left">Edit Pembicara</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <Input label="Nama Lengkap" name="name" register={register} error={errors.name?.message as string} />
        <Input label="Email Pembicara" name="email" type="email" register={register} error={errors.email?.message as string} />
        <Input label="Jabatan" name="role" register={register} error={errors.role?.message as string} />
        <Input label="Instansi" name="institution" register={register} error={errors.institution?.message as string} />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button label="Batal" variant="outline" onClick={() => navigate("/dashboard/pembicara")} />
          <Button label="Perbarui Pembicara" type="submit" />
        </div>
      </form>
    </div>
  );
}