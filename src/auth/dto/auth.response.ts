import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../role.enum';

@ObjectType()
export class AuthResponse {
  // @Field()
  // id!: number;

  // @Field()
  // username!: string;

  // @Field()
  // Role!: string;

  @Field()
  access_token!: string;
}