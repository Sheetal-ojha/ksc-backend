
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TeacherAssignment } from './teacher-assignment.entity';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => TeacherAssignment)
export class TeacherAssignmentResolver {
  constructor(private service: TeacherAssignmentService) {}
@Public()
  @Query(() => [TeacherAssignment])
  teacherAssignments(@Args('teacherId', { type: () => ID }) teacherId: string) {
    return this.service.findByTeacher(teacherId);
  }
@Public()
  @Query(() => [TeacherAssignment])
  classTeachers(@Args('classId', { type: () => ID }) classId: string) {
    return this.service.findByClass(classId);
  }

  @Mutation(() => TeacherAssignment)
  assignTeacher(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @Args('classId', { type: () => ID }) classId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string,
  ) {
    return this.service.assign(teacherId, classId, subjectId);
  }

  @Mutation(() => Boolean)
  removeAssignment(@Args('id', { type: () => ID }) id: string) {
    return this.service.remove(id);
  }
}
