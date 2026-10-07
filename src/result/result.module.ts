import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './result.entity';
import { ResultService } from './result.service';
import { ResultResolver } from './result.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Result])],
  providers: [ResultService, ResultResolver],
  exports: [ResultService],
})
export class ResultModule {}