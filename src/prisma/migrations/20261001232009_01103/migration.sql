/*
  Warnings:

  - A unique constraint covering the columns `[id_pago_externo]` on the table `ventas_web` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_sesion_caja` to the `ventas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPagoWeb" AS ENUM ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "EstadoSesionCaja" AS ENUM ('ABIERTA', 'CERRADA');

-- AlterTable
ALTER TABLE "ventas" ADD COLUMN     "id_sesion_caja" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ventas_web" ADD COLUMN     "estado_pago" "EstadoPagoWeb" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "id_pago_externo" TEXT;

-- CreateTable
CREATE TABLE "pos" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones_caja" (
    "id" SERIAL NOT NULL,
    "id_pos" INTEGER NOT NULL,
    "id_usuario_apertura" INTEGER NOT NULL,
    "fecha_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto_inicial" DECIMAL(10,2) NOT NULL,
    "fecha_cierre" TIMESTAMP(3),
    "monto_cierre" DECIMAL(10,2),
    "estado" "EstadoSesionCaja" NOT NULL DEFAULT 'ABIERTA',

    CONSTRAINT "sesiones_caja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pos_numero_key" ON "pos"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "ventas_web_id_pago_externo_key" ON "ventas_web"("id_pago_externo");

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_sesion_caja_fkey" FOREIGN KEY ("id_sesion_caja") REFERENCES "sesiones_caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_caja" ADD CONSTRAINT "sesiones_caja_id_pos_fkey" FOREIGN KEY ("id_pos") REFERENCES "pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_caja" ADD CONSTRAINT "sesiones_caja_id_usuario_apertura_fkey" FOREIGN KEY ("id_usuario_apertura") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
