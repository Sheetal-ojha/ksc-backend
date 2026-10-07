
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../auth/users/user.entity';
import { Class } from '../department/class.entity';
import { Subject } from '../subject/subject.entity';
import { Department } from '../department/department.entity';
import { HomeworkSubmission } from './homework-submission.entity';

@ObjectType()
@Entity('homeworks')
export class Homework {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

 @Field({ nullable: true })
@Column({ nullable: true })
file_data?: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (u) => u.postedHomeworks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher!: UserEntity;

  @Field(() => Department)
  @ManyToOne(() => Department, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dep_id' })
  department!: Department;

  @Field(() => Class)
  @ManyToOne(() => Class, (c) => c.homeworks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class!: Class;

  @Field(() => Subject)
  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;


 @Field(() => [HomeworkSubmission], { nullable: true })
@OneToMany(() => HomeworkSubmission, (s) => s.homework)
submissions!: HomeworkSubmission[];
}
