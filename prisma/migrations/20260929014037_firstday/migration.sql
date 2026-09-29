-- CreateEnum
CREATE TYPE "EstadoWeb" AS ENUM ('PENDIENTE', 'PAGADO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CAJERO', 'CLIENTEWEB');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENTEWEB',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articulos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT,
    "stock" INTEGER NOT NULL,
    "precio_venta" DECIMAL(10,2) NOT NULL,
    "precio_compra" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "articulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_venta" (
    "id" SERIAL NOT NULL,
    "cantidad_articulos" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_articulo" INTEGER NOT NULL,

    CONSTRAINT "detalles_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas_web" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoWeb" NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "ventas_web_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_venta_web" (
    "id" SERIAL NOT NULL,
    "cantidad_articulos" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "id_ventaweb" INTEGER NOT NULL,
    "id_articulo" INTEGER NOT NULL,

    CONSTRAINT "detalles_venta_web_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compras" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_compra" (
    "id" SERIAL NOT NULL,
    "cantidad_articulos" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "id_compra" INTEGER NOT NULL,

    CONSTRAINT "detalles_compra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_id_articulo_fkey" FOREIGN KEY ("id_articulo") REFERENCES "articulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas_web" ADD CONSTRAINT "ventas_web_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_venta_web" ADD CONSTRAINT "detalles_venta_web_id_ventaweb_fkey" FOREIGN KEY ("id_ventaweb") REFERENCES "ventas_web"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_venta_web" ADD CONSTRAINT "detalles_venta_web_id_articulo_fkey" FOREIGN KEY ("id_articulo") REFERENCES "articulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_compra" ADD CONSTRAINT "detalles_compra_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
