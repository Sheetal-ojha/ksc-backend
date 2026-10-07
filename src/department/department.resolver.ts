import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Department } from './department.entity';
import { Class } from './class.entity';
import { DepartmentService } from './department.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private departmentService: DepartmentService) {}

  @Public()
  @Query(() => [Department])
  async getDepartments(): Promise<Department[]> {
    return this.departmentService.getAllDepartments();
  }

  @Public()
  @Query(() => [Class])
  async getAllClasses(): Promise<Class[]> {
    return this.departmentService.getAllClasses();
  }

  @Public()
  @Query(() => [Class])
  async getClassesByDepartment(
    @Args('depId', { type: () => ID }) depId: string,
  ): Promise<Class[]> {
    return this.departmentService.getClassesByDepartment(depId);
  }
}