
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StudentSubject } from './student-subject.entity';
import { StudentSubjectService } from './student-subject.service';

@Resolver(() => StudentSubject)
export class StudentSubjectResolver {
  constructor(private service: StudentSubjectService) {}

  @Query(() => [StudentSubject])
  mySubjects(@Args('studentId', { type: () => ID }) studentId: string) {
    return this.service.findByStudent(studentId);
  }

  @Mutation(() => StudentSubject)
  chooseOptionalSubject(
    @Args('studentId', { type: () => ID }) studentId: string,
    @Args('classSubjectId', { type: () => ID }) classSubjectId: string,
  ) {
    return this.service.chooseOptional(studentId, classSubjectId);
  }

  @Mutation(() => Boolean)
  removeStudentSubject(@Args('id', { type: () => ID }) id: string) {
    return this.service.remove(id);
  }
}
