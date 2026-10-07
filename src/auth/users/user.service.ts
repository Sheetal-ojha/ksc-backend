import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Role } from '../role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id },
    relations:['class', 'department']
   });
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findByRole(role: Role) {
    return this.repo.findOne({ where: { role } });
  }

  createUser(data: Partial<UserEntity>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  // ✅ FIXED PROPERLY
  findTeacher(teacherId: string, className: string) {
    return this.repo.findOne({
      where: {
        teacherId,
        class: { name: className },
      },
      relations: ['class'],
    });
  }

  // ✅ FIXED
  findStudent(studentId: string, className: string) {
    return this.repo.findOne({
      where: {
        studentId,
        class: { name: className },
      },
      relations: ['class'],
    });
  }

 
  findByStudentId(studentId: string) {
    return this.repo.findOne({ where: { studentId } });
  }

  findByRegisteredId(id: string, role: Role) {
  if (role === Role.STUDENT) return this.repo.findOneBy({ studentId: id });
  if (role === Role.TEACHER) return this.repo.findOneBy({ teacherId: id });
  return null;
}
}