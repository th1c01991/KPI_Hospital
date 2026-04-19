/*
  Warnings:

  - The primary key for the `Indicador` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `direcao` on the `Indicador` table. All the data in the column will be lost.
  - You are about to drop the column `meta` on the `Indicador` table. All the data in the column will be lost.
  - You are about to drop the column `setorId` on the `Indicador` table. All the data in the column will be lost.
  - The primary key for the `Registro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `responsavel` on the `Registro` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Registro` table. All the data in the column will be lost.
  - The primary key for the `Setor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id,nome]` on the table `Indicador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,nome]` on the table `Setor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hospitalId` to the `Indicador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `multiplicador` to the `Indicador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalId` to the `Registro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidade` to the `Registro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsavelId` to the `Registro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setorId` to the `Registro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalId` to the `Setor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Indicador" DROP CONSTRAINT "Indicador_setorId_fkey";

-- DropForeignKey
ALTER TABLE "Registro" DROP CONSTRAINT "Registro_indicadorId_fkey";

-- DropIndex
DROP INDEX "Indicador_nome_setorId_key";

-- DropIndex
DROP INDEX "Setor_nome_key";

-- AlterTable
ALTER TABLE "Indicador" DROP CONSTRAINT "Indicador_pkey",
DROP COLUMN "direcao",
DROP COLUMN "meta",
DROP COLUMN "setorId",
ADD COLUMN     "Descricao" TEXT,
ADD COLUMN     "hospitalId" TEXT NOT NULL,
ADD COLUMN     "multiplicador" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Indicador_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Indicador_id_seq";

-- AlterTable
ALTER TABLE "Registro" DROP CONSTRAINT "Registro_pkey",
DROP COLUMN "responsavel",
DROP COLUMN "valor",
ADD COLUMN     "hospitalId" TEXT NOT NULL,
ADD COLUMN     "quantidade" INTEGER NOT NULL,
ADD COLUMN     "responsavelId" TEXT NOT NULL,
ADD COLUMN     "setorId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "indicadorId" SET DATA TYPE TEXT,
ALTER COLUMN "dataEvento" DROP DEFAULT,
ALTER COLUMN "dataEvento" SET DATA TYPE DATE,
ADD CONSTRAINT "Registro_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Registro_id_seq";

-- AlterTable
ALTER TABLE "Setor" DROP CONSTRAINT "Setor_pkey",
ADD COLUMN     "hospitalId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Setor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Setor_id_seq";

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setor_indicador" (
    "id" TEXT NOT NULL,
    "metaSetor" DECIMAL(10,2),
    "direcaoMeta" TEXT NOT NULL DEFAULT 'MENOR_MELHOR',
    "setorId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "Setor_indicador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariavelOperacional" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DECIMAL(10,2),
    "hospitalId" TEXT NOT NULL,
    "data" DATE NOT NULL,

    CONSTRAINT "VariavelOperacional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_id_nome_cnpj_key" ON "Hospital"("id", "nome", "cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Setor_indicador_id_setorId_indicadorId_hospitalId_key" ON "Setor_indicador"("id", "setorId", "indicadorId", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_id_nome_key" ON "Indicador"("id", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Setor_id_nome_key" ON "Setor"("id", "nome");

-- AddForeignKey
ALTER TABLE "Setor" ADD CONSTRAINT "Setor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor_indicador" ADD CONSTRAINT "Setor_indicador_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor_indicador" ADD CONSTRAINT "Setor_indicador_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor_indicador" ADD CONSTRAINT "Setor_indicador_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicador" ADD CONSTRAINT "Indicador_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariavelOperacional" ADD CONSTRAINT "VariavelOperacional_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
