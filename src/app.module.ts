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

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'pos-ecomm',
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
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {}
