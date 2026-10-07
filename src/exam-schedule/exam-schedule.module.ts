import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSchedule } from './exam-schedule.entity';
import { ExamScheduleService } from './exam-schedule.service';
import { ExamScheduleResolver } from './exam-schedule.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSchedule])],
  providers: [ExamScheduleService, ExamScheduleResolver],
  exports: [ExamScheduleService],
})
export class ExamScheduleModule {}