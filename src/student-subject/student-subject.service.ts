
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubject } from './student-subject.entity';

@Injectable()
export class StudentSubjectService {
  constructor(@InjectRepository(StudentSubject) private repo: Repository<StudentSubject>) {}

 findByStudent(studentId: string) {
  return this.repo
    .createQueryBuilder('ss')
    .leftJoinAndSelect('ss.classSubject', 'cs')
    .leftJoinAndSelect('cs.subject', 'subject')
    .where('ss.student_id = :studentId', { studentId })
    .select([
      'ss.id',
      'cs.id',
      'cs.type',
      'subject.id',
      'subject.name',
      'subject.code',
    ])
    .getMany();
}

  chooseOptional(studentId: string, classSubjectId: string) {
    return this.repo.save(
      this.repo.create({
        student: { id: studentId } as any,
        classSubject: { id: classSubjectId } as any,
      }),
    );
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return true;
  }
}



