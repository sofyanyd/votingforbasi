import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../lib/prisma.js";

let leaderboardCache: any = null;
let leaderboardCacheTime = 0;

export const clearLeaderboardCache = () => {
  leaderboardCache = null;
  leaderboardCacheTime = 0;
};

// GET LEADERBOARD STANDINGS
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const now = Date.now();
    // Cache for 5 seconds
    if (leaderboardCache && (now - leaderboardCacheTime < 5000)) {
      return res.status(200).json(leaderboardCache);
    }

    const finalists = await prisma.finalists.findMany({
      include: {
        votes: true
      }
    });

    const totalVotes = finalists.reduce((acc, f) => acc + f.votes.length, 0);

    const standings = finalists.map(f => {
      const votesCount = f.votes.length;
      const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
      return {
        id: f.id,
        nama: f.nama,
        instansi: f.asal_sekolah,
        votes: votesCount,
        percentage
      };
    });

    // Sort by votes descending
    standings.sort((a, b) => b.votes - a.votes);

    // Assign rank positions
    const standingsWithRank = standings.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    leaderboardCache = standingsWithRank;
    leaderboardCacheTime = now;

    res.status(200).json(standingsWithRank);
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat papan klasemen", error });
  }
};

// GET TRANSACTION HISTORY
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transactions.findMany({
      include: {
        finalists: true
      },
      orderBy: {
        id: "desc"
      }
    });

    const mapped = transactions.map(t => {
      return {
        id: t.code,
        date: t.created_at ? new Date(t.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta"
        }) + " " + new Date(t.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta"
        }) : "-",
        namaKlub: t.finalists.nama,
        voterEmail: t.voter_email,
        votesCount: t.votes_count,
        amount: t.amount,
        kodeUnik: t.kode_unik || 0,
        grandTotal: t.grand_total || t.amount,
        status: t.status === "pending" ? "Pending" : t.status === "Lunas" ? "Lunas" : t.status === "Batal" ? "Batal" : t.status
      };
    });

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error);
    res.status(500).json({ message: "Gagal memuat histori transaksi", error });
  }
};

// SUBMIT VOTES (After checkout/payment - direct submission)
export const submitVotes = async (req: Request, res: Response) => {
  try {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Keranjang vote kosong atau tidak valid" });
    }

    const userId = 2; // Default voter user ID for guest checkout

    await prisma.$transaction(async (tx) => {
      for (const item of cart) {
        const finalistId = Number(item.id);
        const qty = Number(item.qty);

        const finalistExists = await tx.finalists.findUnique({
          where: { id: finalistId }
        });
        if (!finalistExists) {
          throw new Error(`Finalis dengan ID ${finalistId} tidak ditemukan`);
        }

        // 1. Create transaction record for this finalist purchase
        const txCode = `TX-${Math.floor(10000 + Math.random() * 90000)}`;
        await tx.transactions.create({
          data: {
            code: txCode,
            finalist_id: finalistId,
            votes_count: qty,
            amount: qty * 3000,
            voter_email: "guest@forbasi.com",
            status: "Lunas"
          }
        });

        // 2. Create tickets and votes in parallel
        const votePromises = [];
        for (let i = 0; i < qty; i++) {
          const ticketCode = `TICKET-AUTO-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
          
          votePromises.push((async () => {
            const newTicket = await tx.tickets.create({
              data: {
                code: ticketCode,
                status: "used",
                user_id: userId,
                used_at: new Date()
              }
            });

            await tx.votes.create({
              data: {
                user_id: userId,
                finalist_id: finalistId,
                ticket_id: newTicket.id
              }
            });
          })());
        }

        // 3. Eksekusi semua secara bersamaan (Parallel)
        await Promise.all(votePromises);
      }
    }, {
      // SETTING TIMEOUT PRISMA
      maxWait: 5000,   // Maksimal tunggu database merespons: 5 detik
      timeout: 30000,  // Maksimal waktu proses keseluruhan: 30 detik
    });

    res.status(200).json({ message: "Vote berhasil dikirim!" });
  } catch (error: any) {
    console.error("Gagal melakukan voting:", error);
    res.status(500).json({ message: error.message || "Gagal memproses vote", error });
  }
};

export const requestPayment = async (req: Request, res: Response) => {
  try {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Keranjang vote kosong atau tidak valid" });
    }

    const paymentCode = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let totalAmount = 0;
    const voterEmail = "guest@forbasi.com";

    // Hitung total dasar dan validasi input secara ketat
    for (const item of cart) {
      const qty = Number(item.qty);
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ message: "Jumlah vote harus berupa bilangan bulat positif" });
      }

      const finalistId = Number(item.id);
      if (isNaN(finalistId)) {
        return res.status(400).json({ message: "ID Pleton tidak valid" });
      }

      const finalistExists = await prisma.finalists.findUnique({
        where: { id: finalistId }
      });
      if (!finalistExists) {
        return res.status(400).json({ message: `Pleton dengan ID ${finalistId} tidak ditemukan` });
      }

      totalAmount += (qty * 3000);
    }

    // Buat Kode Unik (Selalu 0 karena dicocokkan secara manual via jumlah & tanggal)
    const kodeUnik = 0;
    const grandTotal = totalAmount;

    // Simpan ke database
    for (const item of cart) {
      const finalistId = Number(item.id);
      const qty = Number(item.qty);
      const amount = qty * 3000;

      await prisma.transactions.create({
        data: {
          code: `TX-${finalistId}-${paymentCode}`,
          finalist_id: finalistId,
          votes_count: qty,
          amount: amount, 
          voter_email: voterEmail,
          status: "pending",
          kode_unik: kodeUnik,      
          grand_total: grandTotal   
        }
      });
    }

    // Kembalikan ke frontend
    res.status(200).json({
      transactionCode: paymentCode,
      totalAmount: totalAmount,
      kodeUnik: kodeUnik,
      grandTotal: grandTotal
    });
  } catch (error: any) {
    console.error("Gagal request payment:", error);
    res.status(500).json({ message: error.message || "Gagal memproses request pembayaran" });
  }
};

// COMPLETE PAYMENT HELPER (Idempotent db update for transactions, tickets, and votes)
export const completePayment = async (paymentCode: string) => {
  let cleanCode = paymentCode;
  if (paymentCode.startsWith("TX-")) {
    cleanCode = paymentCode.split("-").slice(2).join("-");
  }

  // Find a voter user, or fall back to the first user in the DB to avoid foreign key violations
  let user = await prisma.users.findFirst({ where: { role: "voter" } });
  if (!user) {
    user = await prisma.users.findFirst();
  }
  const userId = user ? user.id : 2;

  return await prisma.$transaction(async (tx) => {
    // 1. Update status of these transactions to "Lunas" first to prevent race conditions
    const updateResult = await tx.transactions.updateMany({
      where: {
        code: {
          contains: cleanCode
        },
        status: "pending"
      },
      data: {
        status: "Lunas"
      }
    });

    if (updateResult.count === 0) {
      console.log(`No pending transactions found for paymentCode: ${cleanCode} (might be already processed)`);
      return { success: false, message: "No pending transactions found or already processed" };
    }

    // 2. Fetch the transactions we just updated to extract their details
    const transactions = await tx.transactions.findMany({
      where: {
        code: {
          contains: cleanCode
        },
        status: "Lunas"
      }
    });

    // 3. Generate tickets and cast votes in DB
    for (const transaction of transactions) {
      const finalistId = transaction.finalist_id;
      const qty = transaction.votes_count;

      const votePromises = [];
      for (let i = 0; i < qty; i++) {
        const ticketCode = `TXV-${cleanCode}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        votePromises.push((async () => {
          const newTicket = await tx.tickets.create({
            data: {
              code: ticketCode,
              status: "used",
              user_id: userId,
              used_at: new Date()
            }
          });

          await tx.votes.create({
            data: {
              user_id: userId,
              finalist_id: finalistId,
              ticket_id: newTicket.id
            }
          });
        })());
      }
      await Promise.all(votePromises);
    }

    console.log(`Payment code ${paymentCode} completed successfully. Casted votes.`);
    clearLeaderboardCache();
    return { success: true, count: transactions.length };
  });
};

// FINALIZE PAYMENT (Called by frontend after user returns from Snap popup)
export const finalizePayment = async (req: Request, res: Response) => {
  try {
    const { transactionCode } = req.body;
    if (!transactionCode) {
      return res.status(400).json({ message: "Data penyelesaian pembayaran tidak lengkap" });
    }

    const result = await completePayment(transactionCode);
    if (!result.success) {
      // Check if transactions are already "Lunas"
      const existingLunas = await prisma.transactions.findFirst({
        where: {
          code: {
            contains: transactionCode
          },
          status: "Lunas"
        }
      });
      if (existingLunas) {
        return res.status(200).json({ message: "Pembayaran terverifikasi, vote berhasil dimasukkan ke sistem!" });
      }
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({ message: "Pembayaran terverifikasi, vote berhasil dimasukkan ke sistem!" });
  } catch (error: any) {
    console.error("Gagal memfinalisasi pembayaran:", error);
    res.status(500).json({ message: error.message || "Gagal memproses penyelesaian pembayaran", error });
  }
};

// MOOTA WEBHOOK NOTIFICATION (Dipanggil otomatis oleh sistem Moota)
export const mootaWebhook = async (req: Request, res: Response) => {
  try {
    const mutations = req.body;
    console.log("Moota Webhook Received:", mutations);

    for (const mutasi of mutations) {
      if (mutasi.type === 'CR') {
        const nominalMasuk = parseInt(mutasi.amount);

        const pendingTransactions = await prisma.transactions.findMany({
          where: {
            grand_total: nominalMasuk,
            status: "pending"
          }
        });

        if (pendingTransactions.length > 0) {
          const txCode = pendingTransactions[0].code;
          const paymentCode = txCode.split('-').slice(2).join('-'); 

          await completePayment(paymentCode);
          console.log(`Pembayaran otomatis sukses untuk kode ${paymentCode}`);
        }
      }
    }

    res.status(200).send("OK");
  } catch (error: any) {
    console.error("Error di Moota Webhook:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE / CANCEL TRANSACTION (Wipe transaction and its votes/tickets if they exist)
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ message: "Kode transaksi tidak boleh kosong" });
    }

    const codeStr = String(code);
    let cleanCode = codeStr;
    if (codeStr.startsWith("TX-")) {
      cleanCode = codeStr.split("-").slice(2).join("-");
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find all transactions matching the payment code
      const transactions = await tx.transactions.findMany({
        where: {
          code: {
            contains: cleanCode
          }
        }
      });

      // 2. Find all tickets that contain the cleanCode
      const ticketsToDelete = await tx.tickets.findMany({
        where: {
          code: {
            contains: cleanCode
          }
        }
      });

      const ticketIds = ticketsToDelete.map((t) => t.id);

      // Fallback for older transactions that do not contain cleanCode inside their ticket codes
      if (ticketIds.length === 0) {
        for (const transaction of transactions) {
          if (transaction.status === "Lunas" && transaction.created_at) {
            const txTime = new Date(transaction.created_at);
            const fifteenSecondsBefore = new Date(txTime.getTime() - 15000);
            const fifteenSecondsAfter = new Date(txTime.getTime() + 15000);

            // Find votes for this finalist cast around this transaction's timestamp
            const oldVotes = await tx.votes.findMany({
              where: {
                finalist_id: transaction.finalist_id,
                voted_at: {
                  gte: fifteenSecondsBefore,
                  lte: fifteenSecondsAfter
                }
              },
              take: transaction.votes_count
            });

            const oldTicketIds = oldVotes.map((v) => v.ticket_id);
            if (oldTicketIds.length > 0) {
              ticketIds.push(...oldTicketIds);
            }
          }
        }
      }

      // 3. Delete votes linked to these tickets
      if (ticketIds.length > 0) {
        await tx.votes.deleteMany({
          where: {
            ticket_id: {
              in: ticketIds
            }
          }
        });

        // 4. Delete tickets
        await tx.tickets.deleteMany({
          where: {
            id: {
              in: ticketIds
            }
          }
        });
      }

      // 5. Delete transactions
      const deleteResult = await tx.transactions.deleteMany({
        where: {
          code: {
            contains: cleanCode
          }
        }
      });

      return { success: true, deletedCount: deleteResult.count };
    });

    clearLeaderboardCache();
    res.status(200).json({ message: "Transaksi dan seluruh suara terkait berhasil dihapus!", count: result.deletedCount });
  } catch (error: any) {
    console.error("Gagal menghapus transaksi:", error);
    res.status(500).json({ message: error.message || "Gagal menghapus transaksi", error });
  }
};