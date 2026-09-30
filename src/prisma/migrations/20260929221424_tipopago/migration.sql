/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipo_pago` to the `compras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_pago` to the `ventas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Pagos" AS ENUM ('EFECTIVO', 'TRAJETA', 'TRANSFERENCIAQR');

-- AlterTable
ALTER TABLE "compras" ADD COLUMN     "tipo_pago" "Pagos" NOT NULL;

-- AlterTable
ALTER TABLE "ventas" ADD COLUMN     "tipo_pago" "Pagos" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
