import prisma from "../lib/prisma.js";
// GET LEADERBOARD STANDINGS
export const getLeaderboard = async (req, res) => {
    try {
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
        res.status(200).json(standingsWithRank);
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memuat papan klasemen", error });
    }
};
// GET TRANSACTION HISTORY
export const getTransactions = async (req, res) => {
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
                    year: "numeric"
                }) + " " + new Date(t.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit"
                }) : "-",
                namaKlub: t.finalists.nama,
                voterEmail: t.voter_email,
                votesCount: t.votes_count,
                amount: t.amount,
                status: t.status === "pending" ? "Pending" : "Lunas"
            };
        });
        res.status(200).json(mapped);
    }
    catch (error) {
        console.error("Gagal mengambil transaksi:", error);
        res.status(500).json({ message: "Gagal memuat histori transaksi", error });
    }
};
// SUBMIT VOTES (After checkout/payment - direct submission)
export const submitVotes = async (req, res) => {
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
                        amount: qty * 2000,
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
            maxWait: 5000, // Maksimal tunggu database merespons: 5 detik
            timeout: 30000, // Maksimal waktu proses keseluruhan: 30 detik
        });
        res.status(200).json({ message: "Vote berhasil dikirim!" });
    }
    catch (error) {
        console.error("Gagal melakukan voting:", error);
        res.status(500).json({ message: error.message || "Gagal memproses vote", error });
    }
};
// REQUEST PAYMENT (Midtrans Snap Token Generator)
export const requestPayment = async (req, res) => {
    try {
        const { cart } = req.body;
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: "Keranjang vote kosong atau tidak valid" });
        }
        const paymentCode = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;
        let totalAmount = 0;
        const voterEmail = "guest@forbasi.com";
        // 1. Insert pending transaction for each item in cart
        for (const item of cart) {
            const finalistId = Number(item.id);
            const qty = Number(item.qty);
            const amount = qty * 2000; // Rp 2.000 / vote
            totalAmount += amount;
            const uniqueTxCode = `TX-${finalistId}-${paymentCode}`;
            await prisma.transactions.create({
                data: {
                    code: uniqueTxCode,
                    finalist_id: finalistId,
                    votes_count: qty,
                    amount: amount,
                    voter_email: voterEmail,
                    status: "pending"
                }
            });
        }
        // 2. Call Midtrans Snap API to get transaction token
        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
        if (!serverKey) {
            console.warn("WARNING: MIDTRANS_SERVER_KEY is not set in environment. Using mock payment token.");
            return res.status(200).json({
                token: `mock-snap-token-${paymentCode}`,
                redirect_url: `https://mock-redirect.midtrans.com?order_id=${paymentCode}`,
                transactionCode: paymentCode,
                isMock: true
            });
        }
        const midtransUrl = "https://app.sandbox.midtrans.com/snap/v1/transactions";
        const authHeader = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;
        const midtransPayload = {
            transaction_details: {
                order_id: paymentCode,
                gross_amount: totalAmount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: "Voter Guest",
                email: voterEmail
            }
        };
        const midtransResponse = await fetch(midtransUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": authHeader
            },
            body: JSON.stringify(midtransPayload)
        });
        if (!midtransResponse.ok) {
            const errorText = await midtransResponse.text();
            console.error("Midtrans Snap API error response:", errorText);
            throw new Error(`Gagal menghubungi Midtrans Snap API: ${midtransResponse.statusText}`);
        }
        const midtransData = await midtransResponse.json();
        res.status(200).json({
            token: midtransData.token,
            redirect_url: midtransData.redirect_url,
            transactionCode: paymentCode,
            isMock: false
        });
    }
    catch (error) {
        console.error("Gagal request payment:", error);
        res.status(500).json({ message: error.message || "Gagal memproses request pembayaran", error });
    }
};
// FINALIZE PAYMENT (After payment success - updates database and registers votes)
export const finalizePayment = async (req, res) => {
    try {
        const { transactionCode, cart } = req.body;
        if (!transactionCode || !cart || !Array.isArray(cart)) {
            return res.status(400).json({ message: "Data penyelesaian pembayaran tidak lengkap" });
        }
        const userId = 2; // Default guest voter ID
        await prisma.$transaction(async (tx) => {
            // 1. Find and update all pending transactions with this payment code to "Lunas"
            const transactions = await tx.transactions.findMany({
                where: {
                    code: {
                        contains: transactionCode
                    },
                    status: "pending"
                }
            });
            for (const transaction of transactions) {
                await tx.transactions.update({
                    where: { id: transaction.id },
                    data: { status: "Lunas" }
                });
            }
            // 2. Generate tickets and cast votes in DB
            for (const item of cart) {
                const finalistId = Number(item.id);
                const qty = Number(item.qty);
                const votePromises = [];
                for (let i = 0; i < qty; i++) {
                    const ticketCode = `TICKET-MIDTRANS-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
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
        });
        res.status(200).json({ message: "Pembayaran terverifikasi, vote berhasil dimasukkan ke sistem!" });
    }
    catch (error) {
        console.error("Gagal memfinalisasi pembayaran:", error);
        res.status(500).json({ message: error.message || "Gagal memproses penyelesaian pembayaran", error });
    }
};
