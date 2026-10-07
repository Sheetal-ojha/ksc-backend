

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentSubject } from './student-subject.entity';
import { StudentSubjectService } from './student-subject.service';
import { StudentSubjectResolver } from './student-subject.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([StudentSubject])],
  providers: [StudentSubjectService, StudentSubjectResolver],
  exports: [StudentSubjectService],
})
export class StudentSubjectModule {}
