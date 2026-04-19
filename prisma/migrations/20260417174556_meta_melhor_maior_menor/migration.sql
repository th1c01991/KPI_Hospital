/*
  Warnings:

  - The `direcaoMeta` column on the `Indicador_Setor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "meta" AS ENUM ('MENOR_MELHOR', 'MAIOR_MELHOR');

-- AlterTable
ALTER TABLE "Indicador_Setor" DROP COLUMN "direcaoMeta",
ADD COLUMN     "direcaoMeta" "meta" NOT NULL DEFAULT 'MENOR_MELHOR';
