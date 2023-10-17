import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CrudModule } from './crud/crud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev.local',
      isGlobal: true,
      cache: true,
    }),
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
    CrudModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
