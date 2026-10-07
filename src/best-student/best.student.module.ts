import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BestStudentService } from './best.student.service';
import { BestStudentResolver } from './best.student.resolver';
import { Attendance } from '../attendance/attendance.entity';
import { HomeworkSubmission } from '../homework/homework-submission.entity';
import { Feedback } from '../feedback/feedback.entity';
import { Homework } from '../homework/homework.entity';
import { StudentEnrollment } from '../student-enrollment/student-enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, HomeworkSubmission, Feedback, Homework, StudentEnrollment])],
  providers: [BestStudentService, BestStudentResolver],
})
export class BestStudentModule {}