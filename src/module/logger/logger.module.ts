// src/module/logger/logger.module.ts
import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerService } from "./logger.service";
import { ErrorLog } from "./entities/error-log.entity";
import { InfoLog } from "./entities/info-log.entity";
import { WarnLog } from "./entities/warn-log.entity";
import { LoggerController } from "./logger.controller";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ErrorLog, InfoLog, WarnLog])],
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
