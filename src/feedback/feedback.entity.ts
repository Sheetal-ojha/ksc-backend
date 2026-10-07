import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../auth/users/user.entity';
import { HomeworkSubmission } from '../homework/homework-submission.entity';

export enum FeedbackRating {
  EXCELLENT = 'excellent',
  BEST = 'best',
  GOOD = 'good',
  NEED_MODIFY = 'need_modify',
  TRY_AGAIN = 'try_again',
}

@ObjectType()
@Entity('feedbacks')
export class Feedback {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ type: 'enum', enum: FeedbackRating })
  rating!: FeedbackRating;

  @Field({ nullable: true })
  @Column({ nullable: true })
  comment?: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => HomeworkSubmission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submission_id' })
  submission!: HomeworkSubmission;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher!: UserEntity;
}