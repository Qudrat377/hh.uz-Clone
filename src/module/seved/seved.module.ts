import { Module } from '@nestjs/common';
import { SevedService } from './seved.service';
import { SevedController } from './seved.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seved } from './entities/seved.entity';
import { AuthModule } from '../auth/auth.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seved]),
  AuthModule,
  JobsModule
],
  controllers: [SevedController],
  providers: [SevedService],
  exports: [TypeOrmModule, SevedService]
})
export class SevedModule {}
