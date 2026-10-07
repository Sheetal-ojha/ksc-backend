
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassSubject } from './class-subject.entity';

@Injectable()
export class ClassSubjectService {
  constructor(@InjectRepository(ClassSubject) private repo: Repository<ClassSubject>) {}

  findByClass(classId: string) {
    return this.repo.find({
      where: { class: { id: classId } },
      relations: ['subject', 'class'],
    });
  }

  findCompulsoryByClass(classId: string) {
    return this.repo.find({
      where: { class: { id: classId }, type: 'compulsory' },
      relations: ['subject'],
    });
  }

 findOptionalByClass(classId: string) {
  return this.repo
    .createQueryBuilder('cs')
    .leftJoinAndSelect('cs.subject', 'subject')
    .where('cs.class_id = :classId', { classId })
    .andWhere('cs.type = :type', { type: 'optional' })
    .select(['cs.id', 'cs.type', 'subject.id', 'subject.name'])
    .getMany();
}

  create(classId: string, subjectId: string, type: 'compulsory' | 'optional') {
    return this.repo.save(
      this.repo.create({
        class: { id: classId } as any,
        subject: { id: subjectId } as any,
        type,
      }),
    );
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return true;
  }
}
