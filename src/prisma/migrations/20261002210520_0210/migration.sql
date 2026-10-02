/*
  Warnings:

  - The values [TRAJETA] on the enum `Pagos` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Pagos_new" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIAQR');
ALTER TABLE "ventas" ALTER COLUMN "tipo_pago" TYPE "Pagos_new" USING ("tipo_pago"::text::"Pagos_new");
ALTER TABLE "compras" ALTER COLUMN "tipo_pago" TYPE "Pagos_new" USING ("tipo_pago"::text::"Pagos_new");
ALTER TYPE "Pagos" RENAME TO "Pagos_old";
ALTER TYPE "Pagos_new" RENAME TO "Pagos";
DROP TYPE "public"."Pagos_old";
COMMIT;
