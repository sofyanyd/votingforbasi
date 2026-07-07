import prisma from "../lib/prisma.js"; 

const injectBundlingMassal = async (finalistIds: number[]) => {
  const JUMLAH_SUARA = 500; 

  console.log(`⏳ Memproses injeksi BUNDLING ke Pleton dengan ID: [${finalistIds.join(', ')}]...`);

  try {
    // 1. CARI USER VALID SECARA OTOMATIS
    let user = await prisma.users.findFirst({ where: { role: "voter" } });
    if (!user) {
      user = await prisma.users.findFirst();
    }

    if (!user) {
      console.log("❌ GAGAL: Tidak ditemukan satu pun data user di database.");
      return;
    }

    const ADMIN_USER_ID = user.id;
    console.log(`🔑 Menggunakan User ID: ${ADMIN_USER_ID} sebagai relasi formalitas...`);

    // 2. MULAI PERULANGAN INJEKSI PLETON
    for (const finalistId of finalistIds) {
      console.log(`\n🔍 Memeriksa Pleton ID ${finalistId}...`);

      const finalistExists = await prisma.finalists.findUnique({
        where: { id: finalistId }
      });

      if (!finalistExists) {
        console.log(`⏭️ DILEWATI: Pleton dengan ID ${finalistId} tidak ditemukan!`);
        continue; 
      }

      // 3. MULAI TRANSAKSI
      await prisma.$transaction(async (tx) => {
        // PERUBAHAN UTAMA: Menghapus Promise.all dan mengeksekusinya secara berurutan
        for (let i = 0; i < JUMLAH_SUARA; i++) {
          const ticketCode = `BUNDLE-${finalistId}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
          
          // Syarat database: Buat Tiket menggunakan ID user yang divalidasi tadi[cite: 1]
          const newTicket = await tx.tickets.create({
            data: {
              code: ticketCode,
              status: "used",
              user_id: ADMIN_USER_ID,
              used_at: new Date()
            }
          });

          // Syarat database: Buat Vote dan relasikan[cite: 1]
          await tx.votes.create({
            data: {
              user_id: ADMIN_USER_ID,
              finalist_id: finalistId,
              ticket_id: newTicket.id
            }
          });
        }
      }, {
        maxWait: 10000,     // Tunggu koneksi database maksimal 10 detik
        timeout: 120000,    // PERUBAHAN UTAMA: Timeout dinaikkan menjadi 120 detik (2 menit)
      });

      console.log(`✅ BERHASIL: ${JUMLAH_SUARA} suara bundling masuk ke Pleton: ${finalistExists.nama}`);
    }

    console.log(`\n🎉 SEMUA PROSES INJEKSI SELESAI!`);
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat injeksi:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// ==========================================
// TARGET PLETON
// ==========================================
const TARGET_PLETON_IDS = [29, 55]; 

injectBundlingMassal(TARGET_PLETON_IDS);