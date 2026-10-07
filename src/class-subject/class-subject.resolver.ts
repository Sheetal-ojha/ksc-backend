
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ClassSubject } from './class-subject.entity';
import { ClassSubjectService } from './class-subject.service';

@Resolver(() => ClassSubject)
export class ClassSubjectResolver {
  constructor(private service: ClassSubjectService) {}

  @Query(() => [ClassSubject])
  classSubjects(@Args('classId', { type: () => ID }) classId: string) {
    return this.service.findByClass(classId);
  }

  @Query(() => [ClassSubject])
  compulsorySubjects(@Args('classId', { type: () => ID }) classId: string) {
    return this.service.findCompulsoryByClass(classId);
  }

  @Query(() => [ClassSubject])
  optionalSubjects(@Args('classId', { type: () => ID }) classId: string) {
    return this.service.findOptionalByClass(classId);
  }

  @Mutation(() => ClassSubject)
  assignSubjectToClass(
    @Args('classId', { type: () => ID }) classId: string,
    @Args('subjectId', { type: () => ID }) subjectId: string,
    @Args('type') type: string,
  ) {
    return this.service.create(classId, subjectId, type as 'compulsory' | 'optional');
  }

  @Mutation(() => Boolean)
  removeClassSubject(@Args('id', { type: () => ID }) id: string) {
    return this.service.remove(id);
  }
}


