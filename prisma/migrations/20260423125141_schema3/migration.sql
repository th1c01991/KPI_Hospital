/*
  Warnings:

  - You are about to drop the column `hospitalId` on the `Indicador_Setor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[setorId,indicadorId]` on the table `Indicador_Setor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Indicador_Setor" DROP CONSTRAINT "Indicador_Setor_hospitalId_fkey";

-- DropIndex
DROP INDEX "Indicador_Setor_setorId_indicadorId_hospitalId_key";

-- AlterTable
ALTER TABLE "Indicador_Setor" DROP COLUMN "hospitalId";

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_Setor_setorId_indicadorId_key" ON "Indicador_Setor"("setorId", "indicadorId");
