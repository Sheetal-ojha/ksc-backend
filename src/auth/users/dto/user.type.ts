import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ClassType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  grade!: string;
}

@ObjectType()
export class DepartmentType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;

  @Field({ nullable: true })
  studentId?: string;

  @Field({ nullable: true })
  teacherId?: string;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => DepartmentType, { nullable: true })
  department?: DepartmentType;

  @Field(() => ClassType, { nullable: true })
  class?: ClassType;
}