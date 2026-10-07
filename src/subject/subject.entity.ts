
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ClassSubject } from '../class-subject/class-subject.entity';

@ObjectType()
@Entity('subjects')
export class Subject {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ unique: true })
  code!: string;

  @Field()
  @Column({ default: 3 })
  credit_hours!: number;

  @OneToMany(() => ClassSubject, (cs) => cs.subject)
  classSubjects!: ClassSubject[];
}
