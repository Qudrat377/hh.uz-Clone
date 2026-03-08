import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './module/profile/profile.module';
import { JobsModule } from './module/jobs/jobs.module';
import { ReplyModule } from './module/reply/reply.module';
import { Auth } from './module/auth/entities/auth.entity';
import { Profile } from './module/profile/entities/profile.entity';
import { Job } from './module/jobs/entities/job.entity';
import { Reply } from './module/reply/entities/reply.entity';
import { SevedModule } from './module/seved/seved.module';
import { Seved } from './module/seved/entities/seved.entity';
@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    TypeOrmModule.forRoot({
      type: "postgres",
      username: "postgres",
      port: 5432,
      host: "localhost",
      password: String(process.env.DB_PASSWORD),
      database: String(process.env.DB_NAME),
      autoLoadEntities: true,
      entities: [Auth, Profile, Job, Reply, Seved],
      synchronize: true,
      logging: false
    }),
    AuthModule,
    ProfileModule,
    JobsModule,
    ReplyModule,
    SevedModule
  ], 
  controllers: [],
  providers: [],
})
export class AppModule {}
