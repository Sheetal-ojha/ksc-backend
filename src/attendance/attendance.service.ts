import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private repo: Repository<Attendance>) {}

  async findByClassSubjectDate(classId: string, subjectId: string, date: string) {
    return this.repo.find({
      where: { class: { id: classId } as any, subject: { id: subjectId } as any, date },
    });
  }

  async findByStudent(studentId: string, subjectId: string) {
    return this.repo.find({
      where: { student: { id: studentId } as any, subject: { id: subjectId } as any },
    });
  }

  async mark(teacherId: string, studentId: string, classId: string, subjectId: string, date: string, status: string) {
    const existing = await this.repo.findOne({
      where: {
        student: { id: studentId } as any,
        class: { id: classId } as any,
        subject: { id: subjectId } as any,
        date,
      },
    });
    if (existing) {
      if (existing.locked_at) {
        const lockTime = new Date(existing.locked_at).getTime();
        const now = Date.now();
        if (now - lockTime > 60 * 60 * 1000) throw new ForbiddenException('Attendance locked after 1 hour');
      }
      existing.status = status;
      return this.repo.save(existing);
    }
    const now = new Date();
    return this.repo.save(this.repo.create({
      teacher: { id: teacherId } as any,
      student: { id: studentId } as any,
      class: { id: classId } as any,
      subject: { id: subjectId } as any,
      date,
      status,
      locked_at: now,
    }));
  }

  async getStudentsBySubject(subjectId: string, classId: string) {
    return this.repo
      .createQueryBuilder('a')
      .select(['a.student_id'])
      .where('a.subject_id = :subjectId', { subjectId })
      .andWhere('a.class_id = :classId', { classId })
      .distinct(true)
      .getRawMany();
  }
}