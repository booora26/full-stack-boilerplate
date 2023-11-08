import { Module } from '@nestjs/common';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';

@Module({
  controllers: [],
  providers: [],
  imports: [PermissionsModule, RolesModule],
})
export class AuthzModule {}
