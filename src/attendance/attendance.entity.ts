import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../auth/users/user.entity';
import { Class } from '../department/class.entity';
import { Subject } from '../subject/subject.entity';

@ObjectType()
@Entity('attendances')
@Unique(['student', 'class', 'subject', 'date'])
export class Attendance {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ type: 'date' })
  date!: string;

  @Field({ nullable: true })
  @Column({ type: 'time', nullable: true })
  time_in?: string;

  @Field({ nullable: true })
  @Column({ type: 'time', nullable: true })
  time_out?: string;

  @Field()
  @Column({ type: 'enum', enum: ['present', 'absent'] })
  status!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'timestamptz' })
  locked_at?: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher!: UserEntity;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class!: Class;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;
}