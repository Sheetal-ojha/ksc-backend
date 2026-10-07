import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreRegistered } from './pre-registered.entity';
import { Role } from '../role.enum';

@Injectable()
export class PreRegisteredService {
  constructor(@InjectRepository(PreRegistered) private repo: Repository<PreRegistered>) {}

  findById(id: number) {
    return this.repo.findOneBy({ id });
  }

 async add(id: number, role: Role) {
  const existing = await this.repo.findOneBy({ id });
  if (existing) throw new Error('ID already exists');
  return this.repo.save(this.repo.create({ id, role }));
}

  remove(id: number) {
    return this.repo.delete(id);
  }

  findByIdAndRole(id: number, role: Role) {
  return this.repo.findOneBy({ id, role });
}
}