import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, MinLength, IsEnum, IsNotEmpty, IsOptional, ValidateIf, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Role } from '../role.enum';
import { ID } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  username!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  password!: string;

  @Field(() => Role)
  @IsEnum(Role)
  role!: Role;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  photo?: string;

 
  

  // Optional subject IDs — required for +2 students (exactly 2)
@Field(() => ID, { nullable: true })
@IsOptional()
departmentId?: string;

@Field(() => ID, { nullable: true })
@IsOptional()
classId?: string;

@Field(() => [ID], { nullable: true })
@IsOptional()
optionalSubjectIds?: string[];

@Field(() => [ID], { nullable: true })
@IsOptional()
teacherClassIds?: string[];

@Field(() => [ID], { nullable: true })
@IsOptional()
teacherSubjectIds?: string[];

@Field(() => [ID], { nullable: true })
@IsOptional()
teacherDepartmentIds?: string[];

@Field(() => Int, {nullable:true})
// @IsOptional()
@IsNotEmpty()
registeredId!: number;
}