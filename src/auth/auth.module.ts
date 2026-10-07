import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from './users/user.module';
import { Role } from './role.enum';
import { Department } from '../department/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherAssignment } from '../teacher-assignment/teacher-assignment.entity';
import { StudentEnrollment } from '../student-enrollment/student-enrollment.entity';
import { Class } from '../department/class.entity';
import { ClassSubject } from '../class-subject/class-subject.entity';
import { StudentSubject } from '../student-subject/student-subject.entity';
import { PreRegisteredModule } from './pre-registered/pre-registered.module';

@Module({
  imports: [
    UserModule,
    PreRegisteredModule,

    PassportModule,
  TypeOrmModule.forFeature([Department, Class, ClassSubject, StudentSubject, StudentEnrollment, TeacherAssignment]),


JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET')!,
    signOptions: {
      expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '1d') as any,
    },
  }),
})
  ],

  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}