import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';
import { config } from 'dotenv';

config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Iniciando seed...');

  // =====================================================
  // LIMPIAR DATOS
  // =====================================================

  await prisma.detallesDevolucion.deleteMany();
  await prisma.devoluciones.deleteMany();

  await prisma.detallesDevolucionWeb.deleteMany();
  await prisma.devolucionesWeb.deleteMany();

  await prisma.detallesVenta.deleteMany();
  await prisma.ventas.deleteMany();

  await prisma.detallesVentaWeb.deleteMany();
  await prisma.ventasWeb.deleteMany();

  await prisma.detallesCompra.deleteMany();
  await prisma.compras.deleteMany();

  await prisma.sesionCaja.deleteMany();

  await prisma.articulos.deleteMany();
  await prisma.categorias.deleteMany();

  await prisma.proveedores.deleteMany();
  await prisma.pos.deleteMany();

  await prisma.user.deleteMany();

  // =====================================================
  // USUARIOS
  // =====================================================

  const password = await hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      nombre: 'Daniel',
      apellido: 'Administrador',
      email: 'admin@pos.com',
      password,
      role: 'ADMIN',
      direccion: 'Ciudad de México',
    },
  });

  const cajero = await prisma.user.create({
    data: {
      nombre: 'Carlos',
      apellido: 'Cajero',
      email: 'cajero@pos.com',
      password,
      role: 'CAJERO',
      direccion: 'Ciudad de México',
    },
  });

  const cliente = await prisma.user.create({
    data: {
      nombre: 'Laura',
      apellido: 'Cliente',
      email: 'cliente@pos.com',
      password,
      role: 'CLIENTEWEB',
      direccion: 'Ciudad de México',
    },
  });

  console.log('✅ Usuarios creados');

  // =====================================================
  // CATEGORÍAS
  // =====================================================

  const electronica = await prisma.categorias.create({
    data: {
      nombre: 'Electrónica',
    },
  });

  const computacion = await prisma.categorias.create({
    data: {
      nombre: 'Computación',
    },
  });

  const accesorios = await prisma.categorias.create({
    data: {
      nombre: 'Accesorios',
    },
  });

  console.log('✅ Categorías creadas');

  // =====================================================
  // ARTÍCULOS
  // =====================================================

  const mouse = await prisma.articulos.create({
    data: {
      nombre: 'Mouse Logitech M185',
      descripcion: 'Mouse inalámbrico Logitech',
      stock: 50,
      precioVenta: 350,
      precioCompra: 220,
      id_categoria: accesorios.id,
    },
  });

  const teclado = await prisma.articulos.create({
    data: {
      nombre: 'Teclado Logitech K120',
      descripcion: 'Teclado USB',
      stock: 40,
      precioVenta: 450,
      precioCompra: 280,
      id_categoria: computacion.id,
    },
  });

  const monitor = await prisma.articulos.create({
    data: {
      nombre: 'Monitor LG 24 pulgadas',
      descripcion: 'Monitor Full HD',
      stock: 20,
      precioVenta: 3200,
      precioCompra: 2500,
      id_categoria: computacion.id,
    },
  });

  const audifonos = await prisma.articulos.create({
    data: {
      nombre: 'Audífonos Sony',
      descripcion: 'Audífonos estéreo',
      stock: 30,
      precioVenta: 850,
      precioCompra: 600,
      id_categoria: accesorios.id,
    },
  });

  const webcam = await prisma.articulos.create({
    data: {
      nombre: 'Webcam Logitech C920',
      descripcion: 'Webcam Full HD',
      stock: 15,
      precioVenta: 1800,
      precioCompra: 1300,
      id_categoria: electronica.id,
    },
  });

  const usb = await prisma.articulos.create({
    data: {
      nombre: 'Memoria USB 64GB',
      descripcion: 'Memoria USB 3.0',
      stock: 80,
      precioVenta: 250,
      precioCompra: 150,
      id_categoria: electronica.id,
    },
  });

  const disco = await prisma.articulos.create({
    data: {
      nombre: 'SSD Kingston 1TB',
      descripcion: 'SSD SATA 1TB',
      stock: 25,
      precioVenta: 1500,
      precioCompra: 1100,
      id_categoria: computacion.id,
    },
  });

  const bocina = await prisma.articulos.create({
    data: {
      nombre: 'Bocina Bluetooth JBL',
      descripcion: 'Bocina portátil Bluetooth',
      stock: 20,
      precioVenta: 1200,
      precioCompra: 850,
      id_categoria: electronica.id,
    },
  });

  console.log('✅ Artículos creados');

  // =====================================================
  // PROVEEDORES
  // =====================================================

  const proveedor1 = await prisma.proveedores.create({
    data: {
      nombre: 'Distribuidora Tech MX',
      email: 'ventas@techmx.com',
      telefono: '5555555555',
    },
  });

  const proveedor2 = await prisma.proveedores.create({
    data: {
      nombre: 'Computación del Centro',
      email: 'contacto@computacioncentro.com',
      telefono: '5566666666',
    },
  });

  console.log('✅ Proveedores creados');

  // =====================================================
  // POS
  // =====================================================

  const pos1 = await prisma.pos.create({
    data: {
      numero: 1,
      nombre: 'Caja Principal',
      activo: true,
    },
  });

  const pos2 = await prisma.pos.create({
    data: {
      numero: 2,
      nombre: 'Caja Secundaria',
      activo: true,
    },
  });

  console.log('✅ POS creados');

  // =====================================================
  // SESIONES DE CAJA
  // =====================================================

  const sesionAgosto = await prisma.sesionCaja.create({
    data: {
      id_pos: pos1.id,
      id_usuario_apertura: cajero.id,
      fecha_apertura: new Date('2026-08-01T09:00:00'),
      monto_inicial: 1000,
      fecha_cierre: new Date('2026-08-01T20:00:00'),
      monto_cierre: 8500,
      estado: 'CERRADA',
    },
  });

  const sesionSeptiembre = await prisma.sesionCaja.create({
    data: {
      id_pos: pos1.id,
      id_usuario_apertura: cajero.id,
      fecha_apertura: new Date('2026-09-01T09:00:00'),
      monto_inicial: 1500,
      fecha_cierre: new Date('2026-09-30T20:00:00'),
      monto_cierre: 12500,
      estado: 'CERRADA',
    },
  });

  const sesionOctubre = await prisma.sesionCaja.create({
    data: {
      id_pos: pos1.id,
      id_usuario_apertura: cajero.id,
      fecha_apertura: new Date('2026-10-01T09:00:00'),
      monto_inicial: 2000,
      estado: 'ABIERTA',
    },
  });

  console.log('✅ Sesiones de caja creadas');

  // =====================================================
  // VENTAS POS
  // =====================================================

  const venta1 = await prisma.ventas.create({
    data: {
      fecha: new Date('2026-08-01T10:30:00'),
      total: 1200,
      id_usuario: cajero.id,
      id_sesion_caja: sesionAgosto.id,
      tipo_pago: 'EFECTIVO',

      detallesVenta: {
        create: [
          {
            id_articulo: mouse.id,
            cantidadArticulos: 2,
            subtotal: 700,
          },
          {
            id_articulo: usb.id,
            cantidadArticulos: 2,
            subtotal: 500,
          },
        ],
      },
    },
  });

  const venta2 = await prisma.ventas.create({
    data: {
      fecha: new Date('2026-08-01T13:20:00'),
      total: 4050,
      id_usuario: cajero.id,
      id_sesion_caja: sesionAgosto.id,
      tipo_pago: 'TARJETA',

      detallesVenta: {
        create: [
          {
            id_articulo: monitor.id,
            cantidadArticulos: 1,
            subtotal: 3200,
          },
          {
            id_articulo: teclado.id,
            cantidadArticulos: 1,
            subtotal: 450,
          },
          {
            id_articulo: mouse.id,
            cantidadArticulos: 1,
            subtotal: 350,
          },
          {
            id_articulo: usb.id,
            cantidadArticulos: 1,
            subtotal: 250,
          },
        ],
      },
    },
  });

  const venta3 = await prisma.ventas.create({
    data: {
      fecha: new Date('2026-09-05T11:00:00'),
      total: 2650,
      id_usuario: cajero.id,
      id_sesion_caja: sesionSeptiembre.id,
      tipo_pago: 'EFECTIVO',

      detallesVenta: {
        create: [
          {
            id_articulo: audifonos.id,
            cantidadArticulos: 2,
            subtotal: 1700,
          },
          {
            id_articulo: usb.id,
            cantidadArticulos: 2,
            subtotal: 500,
          },
          {
            id_articulo: mouse.id,
            cantidadArticulos: 1,
            subtotal: 350,
          },
          {
            id_articulo: teclado.id,
            cantidadArticulos: 1,
            subtotal: 450,
          },
        ],
      },
    },
  });

  const venta4 = await prisma.ventas.create({
    data: {
      fecha: new Date('2026-09-15T16:30:00'),
      total: 4700,
      id_usuario: cajero.id,
      id_sesion_caja: sesionSeptiembre.id,
      tipo_pago: 'TARJETA',

      detallesVenta: {
        create: [
          {
            id_articulo: monitor.id,
            cantidadArticulos: 1,
            subtotal: 3200,
          },
          {
            id_articulo: audifonos.id,
            cantidadArticulos: 1,
            subtotal: 850,
          },
          {
            id_articulo: usb.id,
            cantidadArticulos: 1,
            subtotal: 250,
          },
          {
            id_articulo: mouse.id,
            cantidadArticulos: 1,
            subtotal: 350,
          },
        ],
      },
    },
  });

  const venta5 = await prisma.ventas.create({
    data: {
      fecha: new Date('2026-09-25T18:00:00'),
      total: 2700,
      id_usuario: cajero.id,
      id_sesion_caja: sesionSeptiembre.id,
      tipo_pago: 'TRANSFERENCIAQR',

      detallesVenta: {
        create: [
          {
            id_articulo: disco.id,
            cantidadArticulos: 1,
            subtotal: 1500,
          },
          {
            id_articulo: webcam.id,
            cantidadArticulos: 1,
            subtotal: 1800,
          },
        ],
      },
    },
  });

  const venta6 = await prisma.ventas.create({
    data: {
      fecha: new Date('2026-10-01T10:00:00'),
      total: 2050,
      id_usuario: cajero.id,
      id_sesion_caja: sesionOctubre.id,
      tipo_pago: 'EFECTIVO',

      detallesVenta: {
        create: [
          {
            id_articulo: disco.id,
            cantidadArticulos: 1,
            subtotal: 1500,
          },
          {
            id_articulo: mouse.id,
            cantidadArticulos: 1,
            subtotal: 350,
          },
          {
            id_articulo: usb.id,
            cantidadArticulos: 1,
            subtotal: 250,
          },
        ],
      },
    },
  });

  console.log('✅ Ventas POS creadas');

  // =====================================================
  // VENTAS WEB
  // =====================================================

  await prisma.ventasWeb.create({
    data: {
      fecha: new Date('2026-09-10T14:00:00'),
      total: 2650,
      id_usuario: cliente.id,
      estadoweb: 'ENTREGADO',
      estado_pago: 'PAGADO',
      id_pago_externo: 'PAY-0001',

      detallesventaweb: {
        create: [
          {
            id_articulo: audifonos.id,
            cantidadArticulos: 2,
            subtotal: 1700,
          },
          {
            id_articulo: usb.id,
            cantidadArticulos: 2,
            subtotal: 500,
          },
          {
            id_articulo: mouse.id,
            cantidadArticulos: 1,
            subtotal: 350,
          },
        ],
      },
    },
  });

  await prisma.ventasWeb.create({
    data: {
      fecha: new Date('2026-10-01T12:00:00'),
      total: 3200,
      id_usuario: cliente.id,
      estadoweb: 'PAGADO',
      estado_pago: 'PAGADO',
      id_pago_externo: 'PAY-0002',

      detallesventaweb: {
        create: [
          {
            id_articulo: monitor.id,
            cantidadArticulos: 1,
            subtotal: 3200,
          },
        ],
      },
    },
  });

  console.log('✅ Ventas web creadas');

  // =====================================================
  // COMPRA 1
  // =====================================================

  const compra1 = await prisma.compras.create({
    data: {
      fecha: new Date('2026-08-01T08:00:00'),
      total: 5000,
      tipo_pago: 'TRANSFERENCIAQR',
      id_proveedor: proveedor1.id,
      id_usuario: admin.id,

      detallescompra: {
        create: [
          {
            id_articulo: mouse.id,
            cantidadArticulos: 10,
            subtotal: 2200,
          },
          {
            id_articulo: usb.id,
            cantidadArticulos: 10,
            subtotal: 1500,
          },
          {
            id_articulo: audifonos.id,
            cantidadArticulos: 2,
            subtotal: 1200,
          },
        ],
      },
    },
  });

  // =====================================================
  // COMPRA 2
  // =====================================================

  await prisma.compras.create({
    data: {
      fecha: new Date('2026-09-01T08:30:00'),
      total: 5000,
      tipo_pago: 'TRANSFERENCIAQR',
      id_proveedor: proveedor2.id,
      id_usuario: admin.id,

      detallescompra: {
        create: [
          {
            id_articulo: monitor.id,
            cantidadArticulos: 2,
            subtotal: 5000,
          },
        ],
      },
    },
  });

  console.log('✅ Compras creadas');

  // =====================================================
  // DEVOLUCIÓN
  // =====================================================

  const detalleVenta = await prisma.detallesVenta.findFirst({
    where: {
      id_venta: venta4.id,
      id_articulo: audifonos.id,
    },
  });

  if (detalleVenta) {
    await prisma.devoluciones.create({
      data: {
        fecha: new Date('2026-09-20T12:00:00'),
        total: 850,
        id_venta: venta4.id,

        detalles: {
          create: [
            {
              cantidad: 1,
              subtotal: 850,
              id_detalle_venta: detalleVenta.id,
            },
          ],
        },
      },
    });

    await prisma.detallesVenta.update({
      where: {
        id: detalleVenta.id,
      },
      data: {
        cantidadDevuelta: 1,
      },
    });
  }

  console.log('✅ Devolución creada');

  console.log('🎉 Seed completado correctamente');
}

main()
  .catch((error) => {
    console.error('❌ Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
