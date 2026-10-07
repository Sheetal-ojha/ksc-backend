
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherAssignment } from './teacher-assignment.entity';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { TeacherAssignmentResolver } from './teacher-assignment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherAssignment])],
  providers: [TeacherAssignmentService, TeacherAssignmentResolver],
  exports: [TeacherAssignmentService],
})
export class TeacherAssignmentModule {}
