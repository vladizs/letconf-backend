import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(AppRoles.DEFAULT)
  .readOwn('profile')
  .updateOwn('profile')
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.DEFAULT)
  .readAny('profile')
  .updateAny('profile')
  .deleteAny('profile')
  .deleteAny('user');
