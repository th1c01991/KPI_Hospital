/*
  Warnings:

  - The primary key for the `Setor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ativo` on the `Setor` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Setor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Setor` table. All the data in the column will be lost.
  - The `id` column on the `Setor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[nome]` on the table `Setor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Setor" DROP CONSTRAINT "Setor_pkey",
DROP COLUMN "ativo",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Setor_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Indicador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "meta" DOUBLE PRECISION NOT NULL,
    "setorId" INTEGER NOT NULL,

    CONSTRAINT "Indicador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "responsavel" TEXT NOT NULL,
    "justificativa" TEXT,
    "indicadorId" INTEGER NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_nome_setorId_key" ON "Indicador"("nome", "setorId");

-- CreateIndex
CREATE UNIQUE INDEX "Setor_nome_key" ON "Setor"("nome");

-- AddForeignKey
ALTER TABLE "Indicador" ADD CONSTRAINT "Indicador_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
