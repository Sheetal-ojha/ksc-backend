
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Class } from '../department/class.entity';
import { Subject } from '../subject/subject.entity';
import { StudentSubject } from '../student-subject/student-subject.entity';

@ObjectType()
@Entity('class_subjects')
@Unique(['class', 'subject'])
export class ClassSubject {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ type: 'enum', enum: ['compulsory', 'optional'] })
  type!: 'compulsory' | 'optional';

  // @Field(() => Class)
  @ManyToOne(() => Class, (c) => c.classSubjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class!: Class;

  @Field(() => Subject)
  @ManyToOne(() => Subject, (s) => s.classSubjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;

  @OneToMany(() => StudentSubject, (ss) => ss.classSubject)
  studentSubjects!: StudentSubject[];
}
