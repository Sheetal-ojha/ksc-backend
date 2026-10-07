
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectService {
  constructor(@InjectRepository(Subject) private repo: Repository<Subject>) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Subject>) {
    return this.repo.save(this.repo.create(data));
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return true;
  }
}


