import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QrCode {
  id: string;
  name: string;
  image: string; // Base64 data URL or external URL
  description: string;
  status: "Aktif" | "Non-Aktif";
}

interface QrState {
  qrList: QrCode[];
  addQrCode: (qr: Omit<QrCode, "id">) => void;
  updateQrCode: (id: string, updated: Omit<QrCode, "id">) => void;
  deleteQrCode: (id: string) => void;
}

const mockQrSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23f8fafc"/><rect x="10" y="10" width="25" height="25" fill="%230f172a" stroke="%23ffffff" stroke-width="2"/><rect x="65" y="10" width="25" height="25" fill="%230f172a" stroke="%23ffffff" stroke-width="2"/><rect x="10" y="65" width="25" height="25" fill="%230f172a" stroke="%23ffffff" stroke-width="2"/><rect x="15" y="15" width="15" height="15" fill="%23ffffff"/><rect x="70" y="15" width="15" height="15" fill="%23ffffff"/><rect x="15" y="70" width="15" height="15" fill="%23ffffff"/><rect x="19" y="19" width="7" height="7" fill="%230f172a"/><rect x="74" y="19" width="7" height="7" fill="%230f172a"/><rect x="19" y="74" width="7" height="7" fill="%230f172a"/><rect x="45" y="45" width="10" height="10" fill="%230f172a"/><rect x="45" y="20" width="8" height="8" fill="%230f172a"/><rect x="20" y="45" width="8" height="8" fill="%230f172a"/><rect x="65" y="45" width="12" height="12" fill="%230f172a"/><rect x="45" y="65" width="12" height="12" fill="%230f172a"/><rect x="65" y="65" width="20" height="20" fill="%230f172a"/><rect x="80" y="45" width="10" height="10" fill="%230f172a"/></svg>`;

const seedQrCodes: QrCode[] = [
  {
    id: "QR-101",
    name: "QRIS DANA / GOPAY",
    image: mockQrSvg,
    description: "Scan barcode ini untuk melakukan pembayaran voting Rp 2.000",
    status: "Aktif",
  },
  {
    id: "QR-102",
    name: "Transfer Bank BCA",
    image: mockQrSvg,
    description: "Rekening BCA 809271827 a/n FORBASI TEGAL",
    status: "Non-Aktif",
  }
];

export const useQrCodeStore = create<QrState>()(
  persist(
    (set) => ({
      qrList: seedQrCodes,
      addQrCode: (qr) =>
        set((state) => {
          const newId = `QR-${Math.floor(100 + Math.random() * 900)}`;
          return {
            qrList: [...state.qrList, { ...qr, id: newId }],
          };
        }),
      updateQrCode: (id, updated) =>
        set((state) => ({
          qrList: state.qrList.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          ),
        })),
      deleteQrCode: (id) =>
        set((state) => ({
          qrList: state.qrList.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "qrcode-storage",
    }
  )
);
