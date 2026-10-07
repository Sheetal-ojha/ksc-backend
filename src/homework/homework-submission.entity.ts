import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../auth/users/user.entity';
import { Homework } from './homework.entity';

@ObjectType()
export class StudentRef {
  @Field(() => ID)
  id!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  studentId?: string;

  @Field({ nullable: true })
  phone?: string;
}

@ObjectType()
@Entity('homework_submissions')
@Unique(['student', 'homework'])
export class HomeworkSubmission {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  paragraph?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  file_data?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image_data?: string;

  @Field()
  @CreateDateColumn()
  submitted_at!: Date;

  @Field(() => StudentRef, { nullable: true })
  @ManyToOne(() => UserEntity, (u) => u.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: UserEntity;

  @ManyToOne(() => Homework, (h) => h.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homework_id' })
  homework!: Homework;
}