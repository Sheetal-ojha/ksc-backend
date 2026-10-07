import { registerEnumType } from '@nestjs/graphql';


export enum Role {
    TEACHER ='TEACHER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  // SUPER_ADMIN ='SUPER_ADMIN',
}
registerEnumType(Role, {
  name: 'Role',
});