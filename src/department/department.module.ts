import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { Class } from './class.entity';
// import { DepartmentService } from './department.service';
// import { DepartmentResolver } from './department.resolver';
import { DepartmentService } from './department.service';
import { DepartmentResolver } from './department.resolver';



@Module({
  imports: [TypeOrmModule.forFeature([Department, Class])],
  providers: [DepartmentService, DepartmentResolver],
  exports: [DepartmentService],
})
export class DepartmentModule {}