import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      entities: [],
      synchronize: true,
      logging: false
    }),
    AuthModule,
  ], 
  controllers: [],
  providers: [],
})
export class AppModule {}
