/*
  Warnings:

  - You are about to drop the column `categoria` on the `articulos` table. All the data in the column will be lost.
  - The `estado` column on the `ventas_web` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[nombre]` on the table `articulos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_categoria` to the `articulos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_articulo` to the `detalles_compra` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('COMPLETADA', 'CANCELADA', 'DEVUELTA', 'DEVUELTA_PARCIAL');

-- AlterTable
ALTER TABLE "articulos" DROP COLUMN "categoria",
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_categoria" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "detalles_compra" ADD COLUMN     "id_articulo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "detalles_venta" ADD COLUMN     "cantidad_devuelta" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "detalles_venta_web" ADD COLUMN     "cantidad_devuelta" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ventas" ADD COLUMN     "estado" "EstadoVenta" NOT NULL DEFAULT 'COMPLETADA';

-- AlterTable
ALTER TABLE "ventas_web" ADD COLUMN     "estadoweb" "EstadoWeb" NOT NULL DEFAULT 'PENDIENTE',
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoVenta" NOT NULL DEFAULT 'COMPLETADA';

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devoluciones" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "id_venta" INTEGER NOT NULL,

    CONSTRAINT "devoluciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_devolucion" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "id_devolucion" INTEGER NOT NULL,
    "id_detalle_venta" INTEGER NOT NULL,

    CONSTRAINT "detalles_devolucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devolucionesweb" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "id_ventaweb" INTEGER NOT NULL,

    CONSTRAINT "devolucionesweb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_devolucion_web" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "id_devolucion" INTEGER NOT NULL,
    "id_detalle_venta" INTEGER NOT NULL,

    CONSTRAINT "detalles_devolucion_web_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "articulos_nombre_key" ON "articulos"("nombre");

-- AddForeignKey
ALTER TABLE "articulos" ADD CONSTRAINT "articulos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_devolucion" ADD CONSTRAINT "detalles_devolucion_id_devolucion_fkey" FOREIGN KEY ("id_devolucion") REFERENCES "devoluciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_devolucion" ADD CONSTRAINT "detalles_devolucion_id_detalle_venta_fkey" FOREIGN KEY ("id_detalle_venta") REFERENCES "detalles_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucionesweb" ADD CONSTRAINT "devolucionesweb_id_ventaweb_fkey" FOREIGN KEY ("id_ventaweb") REFERENCES "ventas_web"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_devolucion_web" ADD CONSTRAINT "detalles_devolucion_web_id_devolucion_fkey" FOREIGN KEY ("id_devolucion") REFERENCES "devolucionesweb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_devolucion_web" ADD CONSTRAINT "detalles_devolucion_web_id_detalle_venta_fkey" FOREIGN KEY ("id_detalle_venta") REFERENCES "detalles_venta_web"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_compra" ADD CONSTRAINT "detalles_compra_id_articulo_fkey" FOREIGN KEY ("id_articulo") REFERENCES "articulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
