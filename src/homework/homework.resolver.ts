
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Homework } from './homework.entity';
import { HomeworkSubmission } from './homework-submission.entity';
import { HomeworkService } from './homework.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => Homework)
export class HomeworkResolver {
  constructor(private service: HomeworkService) {}



  @Query(() => [Homework])
  homeworks(
    @Args('classId', { type: () => ID }) classId: string,
    @Args('depId', { type: () => ID }) depId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string,
  ) {
    return this.service.findByClass(classId, depId, subjectId);
  }

  @Mutation(() => Homework)
  createHomework(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @Args('classId', { type: () => ID }) classId: string,
    @Args('depId', { type: () => ID }) depId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string,
    @Args('title') title: string,
    @Args('description', { nullable: true }) description?: string,
   @Args('file_data', { nullable: true }) file_data?: string,
  ) {
    return this.service.createHomework(teacherId, classId, depId, subjectId, title, description, file_data);
  }

  @Query(() => [HomeworkSubmission])
  submissions(@Args('homeworkId', { type: () => ID }) homeworkId: string) {
    return this.service.findSubmissions(homeworkId);
  }

  @Mutation(() => HomeworkSubmission)
  submitHomework(
    @Args('studentId', { type: () => ID }) studentId: string,
    @Args('homeworkId', { type: () => ID }) homeworkId: string,
    @Args('paragraph', { nullable: true }) paragraph?: string,
   @Args('file_data', { nullable: true }) file_data?: string,
@Args('image_data', { nullable: true }) image_data?: string,
  ) {
    return this.service.submit(studentId, homeworkId, paragraph, file_data, image_data);
  }


  @Mutation(() => Homework)
updateHomework(
  @Args('teacherId', { type: () => ID }) teacherId: string,
  @Args('homeworkId', { type: () => ID }) homeworkId: string,
  @Args('title', { nullable: true }) title?: string,
  @Args('description', { nullable: true }) description?: string,
  @Args('file_data', { nullable: true }) file_data?: string,
) {
  return this.service.updateHomework(teacherId, homeworkId, title, description, file_data);
}

@Mutation(() => Boolean)
deleteHomework(
  @Args('teacherId', { type: () => ID }) teacherId: string,
  @Args('homeworkId', { type: () => ID }) homeworkId: string,
) {
  return this.service.deleteHomework(teacherId, homeworkId);
}

@Mutation(() => Boolean)
deleteSubmission(
  @Args('teacherId', { type: () => ID }) teacherId: string,
  @Args('submissionId', { type: () => ID }) submissionId: string,
) {
  return this.service.deleteSubmission(teacherId, submissionId);
}

@Mutation(() => HomeworkSubmission)
updateSubmission(
  @Args('studentId', { type: () => ID }) studentId: string,
  @Args('submissionId', { type: () => ID }) submissionId: string,
  @Args('paragraph', { nullable: true }) paragraph?: string,
  @Args('file_url', { nullable: true }) file_url?: string,
  @Args('image_url', { nullable: true }) image_url?: string,
) {
  return this.service.updateSubmission(studentId, submissionId, paragraph, file_url, image_url);
}

@Mutation(() => Boolean)
deleteOwnSubmission(
  @Args('studentId', { type: () => ID }) studentId: string,
  @Args('submissionId', { type: () => ID }) submissionId: string,
) {
  return this.service.deleteOwnSubmission(studentId, submissionId);
}

@Public()
@Query(() => [Homework])
homeworksByTeacher(@Args('teacherId', { type: () => ID }) teacherId: string) {
  return this.service.findByTeacher(teacherId);
}
@Public()
@Query(() => Homework, { nullable: true })
homework(@Args('id', { type: () => ID }) id: string) {
  return this.service.findOne(id);
}
}


