import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from './dto/register.input';
import { Role } from './role.enum';
import { UserEntity } from './users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from '../department/department.entity';
import { Repository } from 'typeorm';
import { TeacherAssignment } from '../teacher-assignment/teacher-assignment.entity';
import { StudentEnrollment } from '../student-enrollment/student-enrollment.entity';
import { StudentSubject } from '../student-subject/student-subject.entity';
import { ClassSubject } from '../class-subject/class-subject.entity';
import { Class } from '../department/class.entity';

import { PreRegisteredService } from './pre-registered/pre-registered.service';
import { ID } from '@nestjs/graphql';
@Injectable()
export class AuthService {
 constructor(
  private userService: UserService,
  private jwtService: JwtService,
  @InjectRepository(Department) private departmentRepo: Repository<Department>,
  @InjectRepository(Class) private classRepo: Repository<Class>,
  @InjectRepository(ClassSubject) private classSubjectRepo: Repository<ClassSubject>,
  @InjectRepository(StudentSubject) private studentSubjectRepo: Repository<StudentSubject>,
  @InjectRepository(StudentEnrollment) private enrollmentRepo: Repository<StudentEnrollment>,
  @InjectRepository(TeacherAssignment) private assignmentRepo: Repository<TeacherAssignment>,
  private preRegisteredService: PreRegisteredService,
) {} 

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Wrong password');
    }

   const payload = {
  sub: user.id,            
  email: user.email,
  role: user.role,
  username: user.username,
  studentId: user.studentId,
  teacherId: user.teacherId,
  class: user.class,
  department: user.department,
  phone:user.phone,
};

    return {
      // id: user.id,
      // email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }

 async signUp(data: RegisterInput) {
  const existingUser = await this.userService.findByEmail(data.email);
  if (existingUser) throw new UnauthorizedException('User already exists');

  if (data.role === Role.ADMIN) {
    const adminExists = await this.userService.findByRole(Role.ADMIN);
    if (adminExists) throw new UnauthorizedException('Admin already exists');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userService.createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: Role.ADMIN,
      phone: data.phone,
      photo: data.photo,
    });
  }
  console.log('registeredId:', data.registeredId, typeof data.registeredId);
if (data.role === Role.STUDENT || data.role === Role.TEACHER) {
  if (!data.registeredId) throw new UnauthorizedException('registeredId is required');
}


  const preReg = await this.preRegisteredService.findById(Number(data.registeredId));
  if (!preReg) throw new UnauthorizedException('ID not found in system');
  const alreadyRegistered = await this.userService.findByRegisteredId(String(data.registeredId), data.role);
if (alreadyRegistered) throw new UnauthorizedException('ID already registered, please login');
  if (preReg.role !== data.role) throw new UnauthorizedException('ID role mismatch');

  const hashedPassword = await bcrypt.hash(data.password, 10);

  if (data.role === Role.STUDENT) {
    if (!data.classId || !data.departmentId) throw new UnauthorizedException('Class and department required');

    const department = await this.departmentRepo.findOneBy({ id: data.departmentId as any});
    if (!department) throw new UnauthorizedException('Department not found');

    const cls = await this.classRepo.findOneBy({ id: data.classId });
    if (!cls) throw new UnauthorizedException('Class not found');

    const isPlusTwo = ['eleven', 'twelve'].includes(cls.grade ?? '');
    if (isPlusTwo) {
      if (!data.optionalSubjectIds || data.optionalSubjectIds.length !== 2)
        throw new UnauthorizedException('Must choose exactly 2 optional subjects for +2');
    }

    const user = await this.userService.createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: Role.STUDENT,
      studentId: String(data.registeredId),
      phone: data.phone,
      photo: data.photo,
      department,
      class: cls,
    });

    await this.enrollmentRepo.save(
      this.enrollmentRepo.create({ student: user, class: cls }),
    );

    const compulsorySubjects = await this.classSubjectRepo.find({
      where: { class: { id: data.classId }, type: 'compulsory' },
    });
    for (const cs of compulsorySubjects) {
      await this.studentSubjectRepo.save(
        this.studentSubjectRepo.create({ student: user, classSubject: cs }),
      );
    }

    if (data.optionalSubjectIds?.length) {
      for (const csId of data.optionalSubjectIds) {
        const cs = await this.classSubjectRepo.findOneBy({ id: csId });
        if (cs) {
          await this.studentSubjectRepo.save(
            this.studentSubjectRepo.create({ student: user, classSubject: cs }),
          );
        }
      }
    }

    return user;
  }

  if (data.role === Role.TEACHER) {
    if (!data.teacherDepartmentIds?.length || !data.teacherClassIds?.length || !data.teacherSubjectIds?.length)
      throw new UnauthorizedException('Department, class and subject required for teacher');

    const user = await this.userService.createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: Role.TEACHER,
      teacherId: String(data.registeredId),
      phone: data.phone,
      photo: data.photo,
    });

    for (const classId of data.teacherClassIds) {
      for (const subjectId of data.teacherSubjectIds) {
        await this.assignmentRepo.save(
          this.assignmentRepo.create({
            teacher: user,
            class: { id: classId } as any,
            subject: { id: subjectId } as any,
          }),
        );
      }
    }

    return user;
  }

  throw new UnauthorizedException('Invalid role');
}}