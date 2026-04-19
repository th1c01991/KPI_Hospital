/*
  Warnings:

  - You are about to drop the `Setor_indicador` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,nome,hospitalId,setorId,data]` on the table `VariavelOperacional` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `setorId` to the `VariavelOperacional` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Setor_indicador" DROP CONSTRAINT "Setor_indicador_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "Setor_indicador" DROP CONSTRAINT "Setor_indicador_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "Setor_indicador" DROP CONSTRAINT "Setor_indicador_setorId_fkey";

-- AlterTable
ALTER TABLE "VariavelOperacional" ADD COLUMN     "setorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Setor_indicador";

-- CreateTable
CREATE TABLE "Indicador_Setor" (
    "id" TEXT NOT NULL,
    "metaSetor" DECIMAL(10,2),
    "direcaoMeta" TEXT NOT NULL DEFAULT 'MENOR_MELHOR',
    "setorId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "Indicador_Setor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_Setor_id_setorId_indicadorId_hospitalId_key" ON "Indicador_Setor"("id", "setorId", "indicadorId", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "VariavelOperacional_id_nome_hospitalId_setorId_data_key" ON "VariavelOperacional"("id", "nome", "hospitalId", "setorId", "data");

-- AddForeignKey
ALTER TABLE "Indicador_Setor" ADD CONSTRAINT "Indicador_Setor_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicador_Setor" ADD CONSTRAINT "Indicador_Setor_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicador_Setor" ADD CONSTRAINT "Indicador_Setor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariavelOperacional" ADD CONSTRAINT "VariavelOperacional_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
