
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StudentEnrollment } from './student-enrollment.entity';
import { StudentEnrollmentService } from './student-enrollment.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => StudentEnrollment)
export class StudentEnrollmentResolver {
  constructor(private service: StudentEnrollmentService) {}

  @Query(() => [StudentEnrollment])
  studentEnrollments(@Args('studentId', { type: () => ID }) studentId: string) {
    return this.service.findByStudent(studentId);
  }


  @Public()
  @Query(() => [StudentEnrollment])
  classEnrollments(@Args('classId', { type: () => ID }) classId: string) {
    return this.service.findByClass(classId);
  }

  @Mutation(() => StudentEnrollment)
  enrollStudent(
    @Args('studentId', { type: () => ID }) studentId: string,
    @Args('classId', { type: () => ID }) classId: string,
  ) {
    return this.service.enroll(studentId, classId);
  }

  @Mutation(() => Boolean)
  removeEnrollment(@Args('id', { type: () => ID }) id: string) {
    return this.service.remove(id);
  }
}
