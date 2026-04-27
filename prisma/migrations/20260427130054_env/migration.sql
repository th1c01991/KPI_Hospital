/*
  Warnings:

  - A unique constraint covering the columns `[email,hospitalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hospitalId,setorId,mes]` on the table `VariavelOperacional` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_email_nome_hospitalId_key";

-- DropIndex
DROP INDEX "VariavelOperacional_nome_hospitalId_setorId_mes_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_hospitalId_key" ON "User"("email", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "VariavelOperacional_hospitalId_setorId_mes_key" ON "VariavelOperacional"("hospitalId", "setorId", "mes");
