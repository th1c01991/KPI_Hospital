/*
  Warnings:

  - You are about to drop the column `data` on the `VariavelOperacional` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome,cnpj]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,nome,hospitalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome,hospitalId,setorId,mes]` on the table `VariavelOperacional` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mes` to the `VariavelOperacional` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Hospital_id_nome_cnpj_key";

-- DropIndex
DROP INDEX "VariavelOperacional_id_nome_hospitalId_setorId_data_key";

-- AlterTable
ALTER TABLE "VariavelOperacional" DROP COLUMN "data",
ADD COLUMN     "mes" DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_nome_cnpj_key" ON "Hospital"("nome", "cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_nome_hospitalId_key" ON "User"("email", "nome", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "VariavelOperacional_nome_hospitalId_setorId_mes_key" ON "VariavelOperacional"("nome", "hospitalId", "setorId", "mes");
