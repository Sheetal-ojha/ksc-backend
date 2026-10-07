
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAssignment } from './teacher-assignment.entity';

@Injectable()
export class TeacherAssignmentService {
  constructor(@InjectRepository(TeacherAssignment) private repo: Repository<TeacherAssignment>) {}

  findByTeacher(teacherId: string) {
  return this.repo.find({
    where: { teacher: { id: teacherId }, is_active: true },
    relations: ['class', 'class.department', 'subject'],
  });
}

  findByClass(classId: string) {
    return this.repo.find({
      where: { class: { id: classId }, is_active: true },
      relations: ['teacher', 'subject'],
    });
  }

  assign(teacherId: string, classId: string, subjectId: string) {
    return this.repo.save(
      this.repo.create({
        teacher: { id: teacherId } as any,
        class: { id: classId } as any,
        subject: { id: subjectId } as any,
      }),
    );
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return true;
  }
}




