
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEnrollment } from './student-enrollment.entity';
import { StudentEnrollmentService } from './student-enrollment.service';
import { StudentEnrollmentResolver } from './student-enrollment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEnrollment])],
  providers: [StudentEnrollmentService, StudentEnrollmentResolver],
  exports: [StudentEnrollmentService],
})
export class StudentEnrollmentModule {}
