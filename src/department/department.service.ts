import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { Class } from './class.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,

    @InjectRepository(Class)
    private classRepo: Repository<Class>,
  ) {}

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepo.find({ relations: ['classes'] });
  }

  async getAllClasses(): Promise<Class[]> {
    return this.classRepo.find({ relations: ['department'] });
  }

  async getClassesByDepartment(depId: string): Promise<Class[]> {
    return this.classRepo.find({
      where: { department: { id: depId }  as any },
      relations: ['department'],
    });
  }
  
}