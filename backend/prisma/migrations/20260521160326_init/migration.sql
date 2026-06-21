-- CreateTable
CREATE TABLE "public"."CategoryEvent" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "CategoryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pembicara" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "bidang" TEXT NOT NULL,

    CONSTRAINT "Pembicara_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "pembicaraId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."CategoryEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_pembicaraId_fkey" FOREIGN KEY ("pembicaraId") REFERENCES "public"."Pembicara"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
