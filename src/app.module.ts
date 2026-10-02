import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthService } from './auth/auth.service.js';
import { AuthController } from './auth/auth.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { ArticulosModule } from './articulos/articulos.module.js';
import { ProveedoresModule } from './proveedores/proveedores.module.js';
import { ComprasModule } from './compras/compras.module.js';
import { VentasModule } from './ventas/ventas.module.js';
import { VentasWebModule } from './ventas-web/ventas-web.module.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module.js';
import { PosModule } from './pos/pos.module.js';
import { SesionesCajaModule } from './sesiones-caja/sesiones-caja.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    UsersModule,
    AuthModule,
    ArticulosModule,
    ProveedoresModule,
    ComprasModule,
    VentasModule,
    VentasWebModule,
    CategoriasModule,
    PosModule,
    SesionesCajaModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
