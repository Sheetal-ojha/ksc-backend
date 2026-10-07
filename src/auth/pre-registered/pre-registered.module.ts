import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreRegistered } from './pre-registered.entity';
import { PreRegisteredService } from './pre-registered.service';
import { PreRegisteredResolver } from './pre-registered.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PreRegistered])],
  providers: [PreRegisteredService, PreRegisteredResolver],
  exports: [PreRegisteredService],
})
export class PreRegisteredModule {}