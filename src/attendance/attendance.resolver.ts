import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Attendance } from './attendance.entity';
import { AttendanceService } from './attendance.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => Attendance)
export class AttendanceResolver {
  constructor(private service: AttendanceService) {}

  @Public()
  @Query(() => [Attendance])
  attendanceByClass(
    @Args('classId', { type: () => ID }) classId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string,
    @Args('date') date: string,
  ) {
    return this.service.findByClassSubjectDate(classId, subjectId, date);
  }

  @Public()
  @Query(() => [Attendance])
  studentAttendance(
    @Args('studentId', { type: () => ID }) studentId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string,
  ) {
    return this.service.findByStudent(studentId, subjectId);
  }

  @Public()
  @Mutation(() => Attendance)
  markAttendance(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @Args('studentId', { type: () => ID }) studentId: string,
    @Args('classId', { type: () => ID }) classId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string,
    @Args('date') date: string,
    @Args('status') status: string,
  ) {
    return this.service.mark(teacherId, studentId, classId, subjectId, date, status);
  }
}