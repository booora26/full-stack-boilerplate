import { Module } from '@nestjs/common';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  controllers: [],
  providers: [],
  imports: [PermissionsModule],
})
export class AuthzModule {}
