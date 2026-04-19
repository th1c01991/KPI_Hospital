/*
  Warnings:

  - A unique constraint covering the columns `[nome,hospitalId]` on the table `Indicador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[setorId,indicadorId,hospitalId]` on the table `Indicador_Setor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome,hospitalId]` on the table `Setor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Indicador_id_nome_hospitalId_key";

-- DropIndex
DROP INDEX "Indicador_Setor_id_setorId_indicadorId_hospitalId_key";

-- DropIndex
DROP INDEX "Setor_id_nome_hospitalId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_nome_hospitalId_key" ON "Indicador"("nome", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_Setor_setorId_indicadorId_hospitalId_key" ON "Indicador_Setor"("setorId", "indicadorId", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Setor_nome_hospitalId_key" ON "Setor"("nome", "hospitalId");
