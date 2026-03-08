import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { AuthModule } from '../auth/auth.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]),
  AuthModule,
  JobsModule, 
],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService, TypeOrmModule]
})
export class ReplyModule {}
