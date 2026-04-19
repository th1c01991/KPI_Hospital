/*
  Warnings:

  - You are about to drop the column `Descricao` on the `Indicador` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,nome,hospitalId]` on the table `Indicador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,nome,hospitalId]` on the table `Setor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descricao` to the `Indicador` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Indicador_id_nome_key";

-- DropIndex
DROP INDEX "Setor_id_nome_key";

-- AlterTable
ALTER TABLE "Indicador" DROP COLUMN "Descricao",
ADD COLUMN     "descricao" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_id_nome_hospitalId_key" ON "Indicador"("id", "nome", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Setor_id_nome_hospitalId_key" ON "Setor"("id", "nome", "hospitalId");
