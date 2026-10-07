import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Department } from './department.entity';
import { UserEntity } from '../auth/users/user.entity';
import { Homework } from '../homework/homework.entity';
import { ClassSubject } from '../class-subject/class-subject.entity';
import { StudentEnrollment } from '../student-enrollment/student-enrollment.entity';
import { TeacherAssignment } from '../teacher-assignment/teacher-assignment.entity';

@ObjectType()
export class DepartmentRef {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@ObjectType()
@Entity('classes')
export class Class {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  grade!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  classCode?: string;

  @Field(() => DepartmentRef, { nullable: true })
  @ManyToOne(() => Department, (d) => d.classes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dep_id' })
  department!: Department;

  @OneToMany(() => UserEntity, (u) => u.class)
  users!: UserEntity[];

  @OneToMany(() => Homework, (h) => h.class)
  homeworks!: Homework[];

  @OneToMany(() => ClassSubject, (cs) => cs.class)
  classSubjects!: ClassSubject[];

  @OneToMany(() => StudentEnrollment, (e) => e.class)
  enrollments!: StudentEnrollment[];

  @OneToMany(() => TeacherAssignment, (a) => a.class)
  assignments!: TeacherAssignment[];
}