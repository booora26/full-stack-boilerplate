import { AuthzModule } from './authz.module';
import { PermissionsModule } from './permissions/permissions.module';

export const AUTHZ_ROUTES = [
  {
    path: 'authz',
    module: AuthzModule,
    children: [
      {
        path: 'permissions',
        module: PermissionsModule,
      },
    ],
  },
];
