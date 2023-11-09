import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../authz/roles/roles.module';
import { AuthzModule } from '../authz/authz.module';

@Module({
  imports: [UsersModule, RolesModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
