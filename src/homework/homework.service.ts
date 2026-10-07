
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homework } from './homework.entity';
import { HomeworkSubmission } from './homework-submission.entity';
import { UserEntity } from '../auth/users/user.entity';
import { Role } from '../auth/role.enum';
import { huffmanCompress, huffmanDecompress } from '../common/huffman.util';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Homework) private hwRepo: Repository<Homework>,
    @InjectRepository(HomeworkSubmission) private subRepo: Repository<HomeworkSubmission>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  private compress(base64?: string): string | undefined {
    if (!base64) return undefined;
    const buffer = Buffer.from(base64, 'base64');
    return huffmanCompress(buffer);
  }

  private decompress(data?: string): string | undefined {
    if (!data) return undefined;
    const buffer = huffmanDecompress(data);
    return buffer.toString('base64');
  }

  private decompressHw(hw: Homework): Homework {
    hw.file_data = this.decompress(hw.file_data);
    return hw;
  }

  private decompressSub(sub: HomeworkSubmission): HomeworkSubmission {
    sub.file_data = this.decompress(sub.file_data);
    sub.image_data = this.decompress(sub.image_data);
    return sub;
  }

  async findByClass(classId: string, depId: string, subjectId: string) {
    const list = await this.hwRepo.find({
      where: {
        class: { id: classId } as any,
        department: { id: depId } as any,
        subject: { id: subjectId } as any,
      },
      relations: ['teacher', 'subject', 'submissions'],
    });
    return list.map((hw) => this.decompressHw(hw));
  }

  async createHomework(teacherId: string, classId: string, depId: string, subjectId: string, title: string, description?: string, file_data?: string) {
    const teacher = await this.userRepo.findOneBy({ id: teacherId });
    if (!teacher || teacher.role !== Role.TEACHER) throw new ForbiddenException('Only teachers can post homework');
    return this.hwRepo.save(
      this.hwRepo.create({
        teacher: { id: teacherId } as any,
        class: { id: classId } as any,
        department: { id: depId } as any,
        subject: { id: subjectId } as any,
        title,
        description,
        file_data: this.compress(file_data),
      }),
    );
  }

  async updateHomework(teacherId: string, homeworkId: string, title?: string, description?: string, file_data?: string) {
    const teacher = await this.userRepo.findOneBy({ id: teacherId });
    if (!teacher || teacher.role !== Role.TEACHER) throw new ForbiddenException('Only teachers can update homework');
    const hw = await this.hwRepo.findOne({ where: { id: homeworkId }, relations: ['teacher'] });
    if (!hw) throw new ForbiddenException('Homework not found');
    if (hw.teacher.id !== teacherId) throw new ForbiddenException('You can only update your own homework');
    if (title) hw.title = title;
    if (description) hw.description = description;
    if (file_data) hw.file_data = this.compress(file_data);
    return this.decompressHw(await this.hwRepo.save(hw));
  }

  async deleteHomework(teacherId: string, homeworkId: string) {
    const teacher = await this.userRepo.findOneBy({ id: teacherId });
    if (!teacher || teacher.role !== Role.TEACHER) throw new ForbiddenException('Only teachers can delete homework');
    const hw = await this.hwRepo.findOne({ where: { id: homeworkId }, relations: ['teacher'] });
    if (!hw) throw new ForbiddenException('Homework not found');
    if (hw.teacher.id !== teacherId) throw new ForbiddenException('You can only delete your own homework');
    await this.hwRepo.delete(homeworkId);
    return true;
  }

  async deleteSubmission(teacherId: string, submissionId: string) {
    const teacher = await this.userRepo.findOneBy({ id: teacherId });
    if (!teacher || teacher.role !== Role.TEACHER) throw new ForbiddenException('Only teachers can delete submissions');
    await this.subRepo.delete(submissionId);
    return true;
  }

  async findSubmissions(homeworkId: string) {
    const list = await this.subRepo.find({
      where: { homework: { id: homeworkId } },
      relations: ['student'],
    });
    return list.map((s) => this.decompressSub(s));
  }

  async submit(studentId: string, homeworkId: string, paragraph?: string, file_data?: string, image_data?: string) {
    const student = await this.userRepo.findOneBy({ id: studentId });
    if (!student || student.role !== Role.STUDENT) throw new ForbiddenException('Only students can submit homework');
    return this.decompressSub(
      await this.subRepo.save(
        this.subRepo.create({
          student: { id: studentId } as any,
          homework: { id: homeworkId } as any,
          paragraph,
          file_data: this.compress(file_data),
          image_data: this.compress(image_data),
        }),
      ),
    );
  }

  async updateSubmission(studentId: string, submissionId: string, paragraph?: string, file_data?: string, image_data?: string) {
    const student = await this.userRepo.findOneBy({ id: studentId });
    if (!student || student.role !== Role.STUDENT) throw new ForbiddenException('Only students can update their submission');
    const sub = await this.subRepo.findOne({ where: { id: submissionId }, relations: ['student'] });
    if (!sub) throw new ForbiddenException('Submission not found');
    if (sub.student.id !== studentId) throw new ForbiddenException('You can only update your own submission');
    if (paragraph) sub.paragraph = paragraph;
    if (file_data) sub.file_data = this.compress(file_data);
    if (image_data) sub.image_data = this.compress(image_data);
    return this.decompressSub(await this.subRepo.save(sub));
  }

  async deleteOwnSubmission(studentId: string, submissionId: string) {
    const student = await this.userRepo.findOneBy({ id: studentId });
    if (!student || student.role !== Role.STUDENT) throw new ForbiddenException('Only students can delete their submission');
    const sub = await this.subRepo.findOne({ where: { id: submissionId }, relations: ['student'] });
    if (!sub) throw new ForbiddenException('Submission not found');
    if (sub.student.id !== studentId) throw new ForbiddenException('You can only delete your own submission');
    await this.subRepo.delete(submissionId);
    return true;
  }

  findByTeacher(teacherId: string) {
  return this.hwRepo.find({
    where: { teacher: { id: teacherId } },
    relations: ['subject', 'class', 'submissions', 'submissions.student'],
  });
}
async findOne(id: string) {
  const hw = await this.hwRepo.findOne({ where: { id } });
  if (!hw) return null;
  hw.file_data = this.decompress(hw.file_data);
  return hw;
}
} 
