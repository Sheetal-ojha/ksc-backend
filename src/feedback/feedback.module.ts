import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { UserEntity } from '../auth/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, UserEntity])],
  providers: [FeedbackService, FeedbackResolver],
  exports: [FeedbackService],
})
export class FeedbackModule {}