
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from './homework.entity';
import { HomeworkSubmission } from './homework-submission.entity';
import { HomeworkService } from './homework.service';
import { HomeworkResolver } from './homework.resolver';
import { UserEntity } from '../auth/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Homework, HomeworkSubmission,UserEntity])],
  providers: [HomeworkService, HomeworkResolver],
  exports: [HomeworkService],
})
export class HomeworkModule {}
