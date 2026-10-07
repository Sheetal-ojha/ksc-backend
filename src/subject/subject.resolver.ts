
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Subject } from './subject.entity';
import { SubjectService } from './subject.service';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => Subject)
export class SubjectResolver {
  constructor(private service: SubjectService) {}


  @Public()
  @Query(() => [Subject])
  subjects() {
    return this.service.findAll();
  }
@Public()
  @Query(() => Subject, { nullable: true })
  subject(@Args('id', { type: () => ID }) id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => Subject)
  createSubject(
    @Args('name') name: string,
    @Args('code') code: string,
    @Args('credit_hours', { defaultValue: 3 }) credit_hours: number,
  ) {
    return this.service.create({ name, code, credit_hours });
  }

  @Mutation(() => Boolean)
  removeSubject(@Args('id', { type: () => ID }) id: string) {
    return this.service.remove(id);
  }
}

