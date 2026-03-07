import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [TypeOrmModule, JobsService],
  // exports: [TypeOrmModule, Job]
})
export class JobsModule {}
