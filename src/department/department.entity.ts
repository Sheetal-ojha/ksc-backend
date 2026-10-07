import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Class } from './class.entity';
import { UserEntity } from '../auth/users/user.entity';

@ObjectType()
@Entity('departments')
export class Department {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Class, (c) => c.department, { cascade: true })
  classes!: Class[];

  @OneToMany(() => UserEntity, (u) => u.department)
  usere!: UserEntity[];
}