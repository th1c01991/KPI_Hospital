/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Hospital_nome_cnpj_key";

-- DropIndex
DROP INDEX "Indicador_nome_hospitalId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_cnpj_key" ON "Hospital"("cnpj");
