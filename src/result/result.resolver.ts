import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { Result } from './result.entity';
import { ResultService } from './result.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => Result)
export class ResultResolver {
  constructor(private service: ResultService) {}

  @Public()
  @Mutation(() => Result)
  createResult(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @Args('classId', { type: () => ID }) classId: string,
    @Args('depId', { type: () => ID }) depId: string,
    @Args('title') title: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('file_data', { nullable: true }) file_data?: string,
    @Args('image_data', { nullable: true }) image_data?: string,
  ) {
    return this.service.create(teacherId, classId, depId, title, description, file_data, image_data);
  }

  @Public()
  @Query(() => [Result])
  resultsByClass(
    @Args('classId', { type: () => ID }) classId: string,
    @Args('depId', { type: () => ID }) depId: string,
  ) {
    return this.service.findByClassAndDep(classId, depId);
  }
}