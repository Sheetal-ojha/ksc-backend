import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PreRegistered } from './pre-registered.entity';
import { PreRegisteredService } from './pre-registered.service';
import { Role } from '../role.enum';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { RolesGuard } from '../role.guard';
import { Roles } from '../role.decorator';
import { Public } from '../decorators/public.decorator';
@Resolver(() => PreRegistered)
export class PreRegisteredResolver {
  constructor(private service: PreRegisteredService) {}

  @Query(() => [PreRegistered])
  preRegisteredList() {
    return this.service['repo'].find();
  }

@Public()
@Query(() => PreRegistered)
async verifyId(
  @Args('id', { type: () => Int }) id: number,
  @Args('role', { type: () => Role }) role: Role,
) {
  const result = await this.service.findByIdAndRole(id, role);
  if (!result) throw new Error('ID invalid');
  return result;
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => PreRegistered)
  addPreRegistered(
    @Args('id', { type: () => Int }) id: number,
    @Args('role', { type: () => Role }) role: Role,
  ) {
    return this.service.add(id, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  removePreRegistered(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}