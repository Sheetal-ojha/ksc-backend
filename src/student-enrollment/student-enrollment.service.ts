
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEnrollment } from './student-enrollment.entity';

@Injectable()
export class StudentEnrollmentService {
  constructor(@InjectRepository(StudentEnrollment) private repo: Repository<StudentEnrollment>) {}

  findByStudent(studentId: string) {
    return this.repo.find({
      where: { student: { id: studentId } },
      relations: ['class'],
    });
  }

async findByClass(classId: string) {
  const result = await this.repo.find({
    where: { class: { id: classId }, status: 'active' },
    relations: ['student'],
  });
  console.log('findByClass result:', JSON.stringify(result[0]));
  return result;
}a

  enroll(studentId: string, classId: string) {
    return this.repo.save(
      this.repo.create({
        student: { id: studentId } as any,
        class: { id: classId } as any,
      }),
    );
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return true;
  }
}




