import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './serializer/local.serializer';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalSerializer,
    LocalStrategy,
    { provide: APP_GUARD, useClass: AuthenticatedGuard }, // omogucavan da Guard postane globalni
  ],
  exports: [AuthService],
})
export class AuthModule {}
