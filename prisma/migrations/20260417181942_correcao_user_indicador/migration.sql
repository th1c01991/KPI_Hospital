/*
  Warnings:

  - You are about to drop the column `direcaoMeta` on the `Indicador_Setor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `nome` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Indicador" ADD COLUMN     "direcaoMeta" "meta" NOT NULL DEFAULT 'MENOR_MELHOR';

-- AlterTable
ALTER TABLE "Indicador_Setor" DROP COLUMN "direcaoMeta";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "nome" TEXT NOT NULL;
