
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../auth/users/user.entity';
import { ClassSubject } from '../class-subject/class-subject.entity';

@ObjectType()
@Entity('student_subjects')
@Unique(['student', 'classSubject'])
export class StudentSubject {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (u) => u.studentSubjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: UserEntity;

  @Field(() => ClassSubject)
  @ManyToOne(() => ClassSubject, (cs) => cs.studentSubjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_subject_id' })
  classSubject!: ClassSubject;
}
