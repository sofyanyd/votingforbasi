import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
// Pastikan path store ini sesuai dengan file store kamu yang sekarang
import { usePembicaraStore } from "../../../stores/PembicaraStore"; 

interface PembicaraFormInputs {
  name: string;
  role: string;
  institution: string;
  email: string;
}

export default function PembicaraCreate() {
  const navigate = useNavigate();
  // Gunakan fungsi dari store yang sudah konsisten namanya
  const { addPembicara } = usePembicaraStore(); 
  
  const { register, handleSubmit, formState: { errors } } = useForm<PembicaraFormInputs>();

  const onSubmit = async (data: PembicaraFormInputs) => {
    const payload = {
      nama: data.name,
      bidang: `${data.role} di ${data.institution}`,
      email: data.email
    };

    const success = await addPembicara(payload);
    if (success) {
      alert("Pembicara baru berhasil ditambahkan.");
      navigate("/dashboard/pembicara"); // Path rute yang benar
    } else {
      alert("Gagal menambahkan pembicara. Pastikan server backend berjalan.");
    }
  };

  return (
    <div className="px-10 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#7B1D3F] mb-8 text-left">Tambah Pembicara</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <Input 
          label="Nama Lengkap" 
          name="name" 
          register={register} 
          error={errors.name?.message} 
        />
        
        <Input 
          label="Email Pembicara" 
          name="email" 
          type="email"
          placeholder="Contoh: nama@mail.com"
          register={register} 
          error={errors.email?.message} 
        />
        
        <Input 
          label="Jabatan" 
          name="role" 
          placeholder="Contoh: Senior Developer" 
          register={register} 
          error={errors.role?.message} 
        />
        
        <Input 
          label="Instansi" 
          name="institution" 
          placeholder="Contoh: AWS Indonesia" 
          register={register} 
          error={errors.institution?.message} 
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button label="Batal" variant="outline" onClick={() => navigate("/dashboard/pembicara")} />
          <Button label="Simpan Pembicara" type="submit" />
        </div>
      </form>
    </div>
  );
}