import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './serializer/session.serializer';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { APP_GUARD } from '@nestjs/core';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { GitHubStrategy } from './strategies/github.strategy';
import { ImpersonateStrategy } from './strategies/impersonate.strategy';
import { TwoFAStrategy } from './strategies/twoFA.strategy';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    EmployeesModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionSerializer,
    LocalStrategy,
    GoogleStrategy,
    GitHubStrategy,
    ImpersonateStrategy,
    TwoFAStrategy,
    { provide: APP_GUARD, useClass: AuthenticatedGuard }, // omogucavan da Guard postane globalni
  ],
  exports: [AuthService],
})
export class AuthModule {}
