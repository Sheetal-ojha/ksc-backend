import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Role } from '../role.enum';
import { Roles } from '../role.decorator';
import { ForbiddenException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserType } from './dto/user.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UserService) {}

  // ADMIN only - get all users
  @Roles(Role.ADMIN)
  @Query(() => [UserType])
  users() {
    return this.userService.findAll();
  }

  // ALL roles - get own profile from JWT token only
  @Query(() => UserType)
  async getProfile(@Context() context: any) {
    const currentUser = context.req.user;
    if (!currentUser) throw new ForbiddenException('Not authenticated');
    return this.userService.findById(currentUser.userId);
  }

  // ADMIN and TEACHER only - get any student by studentId
  @Roles(Role.ADMIN, Role.TEACHER)
  @Query(() => UserType)
  async getStudentById(@Args('studentId') studentId: string) {
    return this.userService.findByStudentId(studentId);
  }
}