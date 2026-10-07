import { OneToMany } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column,Entity,JoinColumn } from "typeorm";
import { ID } from "@nestjs/graphql";
import { Role } from "../role.enum";

import { Department } from "../../department/department.entity";
import { ManyToOne } from "typeorm";
import { Class } from "../../department/class.entity";
import { Homework } from "../../homework/homework.entity";
import { TeacherAssignment } from "../../teacher-assignment/teacher-assignment.entity";
import { HomeworkSubmission } from "../../homework/homework-submission.entity";
import { StudentEnrollment } from "../../student-enrollment/student-enrollment.entity";
import { StudentSubject } from "../../student-subject/student-subject.entity";

@ObjectType()
@Entity()
export class UserEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  username!: string;

  @Field()
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role!: Role;

  

  @Field({ nullable: true })
  @Column({ nullable: true })
  studentId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  teacherId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  photo?: string;



  // @Field(() => Department, { nullable: true })
  @ManyToOne(() => Department, (d) => d.usere, { nullable: true })
  @JoinColumn({ name: 'dep_id' })
  department?: Department;

  // @Field(() => Class, { nullable: true })
  @ManyToOne(() => Class, (c) => c.users, { nullable: true })
  @JoinColumn({ name: 'class_id' })
  class?: Class;


  
  // @OneToMany(() => Homework, (h) => h.teacher)
  // homeworks!: Homework[];



//   @Column({ nullable: true })
// grade?: string; 



@OneToMany(() => StudentSubject, (ss) => ss.student)
studentSubjects!: StudentSubject[];

@OneToMany(() => StudentEnrollment, (e) => e.student)
enrollments!: StudentEnrollment[];

@OneToMany(() => TeacherAssignment, (a) => a.teacher)
assignments!: TeacherAssignment[];

@OneToMany(() => Homework, (h) => h.teacher)
postedHomeworks!: Homework[];

@OneToMany(() => HomeworkSubmission, (s) => s.student)
submissions!: HomeworkSubmission[];


}