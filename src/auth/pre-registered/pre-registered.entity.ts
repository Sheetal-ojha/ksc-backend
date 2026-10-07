import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '../role.enum';

@ObjectType()
@Entity('pre_registered')
export class PreRegistered {
  @Field(() => Int)
  @PrimaryColumn({ type: 'int' })
  id!: number;

  @Field(() => Role)
  @Column({ type: 'enum', enum: [Role.STUDENT, Role.TEACHER] })
  role!: Role;
}