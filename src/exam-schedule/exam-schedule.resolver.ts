import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { ExamSchedule } from './exam-schedule.entity';
import { ExamScheduleService } from './exam-schedule.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => ExamSchedule)
export class ExamScheduleResolver {
  constructor(private service: ExamScheduleService) {}

  @Public()
  @Mutation(() => ExamSchedule)
  createExamSchedule(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @Args('title') title: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('file_data', { nullable: true }) file_data?: string,
    @Args('image_data', { nullable: true }) image_data?: string,
    @Args('exam_date', { nullable: true }) exam_date?: string,
  ) {
    return this.service.create(teacherId, title, description, file_data, image_data, exam_date);
  }

  @Public()
  @Query(() => [ExamSchedule])
  examSchedules() {
    return this.service.findAll();
  }
}