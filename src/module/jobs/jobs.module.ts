import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { ReplyModule } from '../reply/reply.module';
import { AuthModule } from '../auth/auth.module';

@Module({ 
  imports: [
    TypeOrmModule.forFeature([Job]),
    AuthModule,
  ],
  controllers: [JobsController],
  providers: [TypeOrmModule, JobsService],
  exports: [TypeOrmModule, JobsService]
})
export class JobsModule {}
