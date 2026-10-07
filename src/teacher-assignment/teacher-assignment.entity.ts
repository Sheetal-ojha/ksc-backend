
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../auth/users/user.entity';
import { Class } from '../department/class.entity';
import { Subject } from '../subject/subject.entity';

@ObjectType()
@Entity('teacher_assignments')
@Unique(['teacher', 'class', 'subject'])
export class TeacherAssignment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (u) => u.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher!: UserEntity;

  @Field(() => Class)
  @ManyToOne(() => Class, (c) => c.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class!: Class;

  @Field(() => Subject)
  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;

  @Field()
  @Column({ default: true })
  is_active!: boolean;
}
