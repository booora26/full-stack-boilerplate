import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthzModule } from './authz/authz.module';
import { RouterModule } from '@nestjs/core';
import { AUTHZ_ROUTES } from './authz/authz-routes';
import { SeedModule } from './seed/seed.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ShiftsModule } from './shifts/shifts.module';
import { ServicesModule } from './services/services.module';
import { ShopModule } from './shop/shop.module';
import { RatesModule } from './rates/rates.module';
import { EmployeesModule } from './employees/employees.module';

const ROUTES = [...AUTHZ_ROUTES];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev.local',
      isGlobal: true,
      cache: true,
    }),
    RouterModule.register(ROUTES),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port: configService.get<number>('PG_PORT'),
        username: configService.get<string>('PG_USER'),
        password: configService.get<string>('PG_PASS'),
        database: configService.get<string>('PG_DB'),
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        subscribers: [],
      }),
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    AuthzModule,
    SeedModule,
    AppointmentModule,
    ShiftsModule,
    ServicesModule,
    ShopModule,
    RatesModule,
    EmployeesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
