import { Resolver, Query, Args, ID, Int, ObjectType, Field } from '@nestjs/graphql';
import { BestStudentService } from './best.student.service';
import { Public } from '../auth/decorators/public.decorator';

@ObjectType()
export class BestStudentResult {
  @Field()
  studentId!: string;

  @Field()
  username!: string;

  @Field()
  studentPreRegId!: string;

  @Field()
  attendanceScore!: number;

  @Field()
  homeworkScore!: number;

  @Field()
  feedbackScore!: number;

  @Field()
  totalScore!: number;
}

@Resolver()
export class BestStudentResolver {
  constructor(private service: BestStudentService) {}

  @Public()
  @Query(() => BestStudentResult, { nullable: true })
  bestStudentOfMonth(
    @Args('classId', { type: () => ID }) classId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string,
    @Args('month', { type: () => Int }) month: number,
    @Args('year', { type: () => Int }) year: number,
  ) {
    return this.service.getBestStudent(classId, subjectId, month, year);
  }
}