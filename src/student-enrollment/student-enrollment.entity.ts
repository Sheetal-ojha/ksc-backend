
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../auth/users/user.entity';
import { Class } from '../department/class.entity';
import { StudentRef } from '../homework/homework-submission.entity';

@ObjectType()
@Entity('student_enrollments')
@Unique(['student', 'class'])
export class StudentEnrollment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => StudentRef,{nullable:true})
  @ManyToOne(() => UserEntity, (u) => u.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: UserEntity;

  // @Field(() => Class)
  @ManyToOne(() => Class, (c) => c.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class!: Class;

  @Field()
  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status!: string;

  @Field()
  @CreateDateColumn()
  enrolled_at!: Date;
}
