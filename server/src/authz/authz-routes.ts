import { AuthzModule } from './authz.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';

export const AUTHZ_ROUTES = [
  {
    path: 'authz',
    module: AuthzModule,
    children: [
      {
        path: 'permissions',
        module: PermissionsModule,
      },
      {
        path: 'roles',
        module: RolesModule,
      },
    ],
  },
];
