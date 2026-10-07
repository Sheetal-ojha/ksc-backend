
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSubject } from './class-subject.entity';
import { ClassSubjectService } from './class-subject.service';
import { ClassSubjectResolver } from './class-subject.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ClassSubject])],
  providers: [ClassSubjectService, ClassSubjectResolver],
  exports: [ClassSubjectService],
})
export class ClassSubjectModule {}
