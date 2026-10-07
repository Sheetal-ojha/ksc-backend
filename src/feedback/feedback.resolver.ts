import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { Feedback, FeedbackRating } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => Feedback)
export class FeedbackResolver {
  constructor(private service: FeedbackService) {}

  @Public()
  @Mutation(() => Feedback)
  giveFeedback(
    @Args('teacherId', { type: () => ID }) teacherId: string,
    @Args('submissionId', { type: () => ID }) submissionId: string,
    @Args('rating', { type: () => String }) rating: FeedbackRating,
    @Args('comment', { nullable: true }) comment?: string,
  ) {
    return this.service.giveFeedback(teacherId, submissionId, rating, comment);
  }

  @Public()
  @Query(() => Feedback, { nullable: true })
  feedbackBySubmission(@Args('submissionId', { type: () => ID }) submissionId: string) {
    return this.service.findBySubmission(submissionId);
  }
}