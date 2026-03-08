import { InjectRepository } from "@nestjs/typeorm";
import { ErrorLog } from "./entities/error-log.entity";
import { InfoLog } from "./entities/info-log.entity";
import { WarnLog } from "./entities/warn-log.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService implements LoggerService {
  constructor(
    @InjectRepository(ErrorLog) private readonly errorRepo: Repository<ErrorLog>,
    @InjectRepository(InfoLog) private readonly infoRepo: Repository<InfoLog>,
    @InjectRepository(WarnLog) private readonly warnRepo: Repository<WarnLog>,
  ) {}

  // Faqat siz qo'lda yozgan loglarni tekshirish uchun yordamchi funksiya
  private isUserLog(context?: string): boolean {
    // NestJS ichki modullari ro'yxati
    const nestContexts = [
      'InstanceLoader', 'RoutesResolver', 'RouterExplorer', 
      'NestFactory', 'NestApplication', 'ExceptionHandler'
    ];
    // Agar context berilmagan bo'lsa yoki u NestJS modullaridan biri bo'lmasa - demak bu sizniki
    return context ? !nestContexts.includes(context) : true;
  }

  async log(message: string, context?: string) {
    console.log(`[INFO] ${message}`);
    // NestJS loglarini bazaga yozmaymiz, faqat siznikini
    if (this.isUserLog(context)) {
      await this.infoRepo.save({ message, context });
    }
  }

  async error(message: string, stack?: string, context?: string) {
    console.error(`[ERROR] ${message}`);
    if (this.isUserLog(context)) {
      await this.errorRepo.save({ message, stack, context });
    }
  }

  async warn(message: string, context?: string) {
    console.warn(`[WARN] ${message}`);
    if (this.isUserLog(context)) {
      await this.warnRepo.save({ message, context });
    }
  }

  // Barcha Error loglarni olish
  async getErrors() {
    return await this.errorRepo.find({
      order: { id: 'DESC' }, // Oxirgi xatolar birinchi chiqadi
      take: 100, // Faqat oxirgi 100 tasini olamiz
    });
  }

  // Barcha Info loglarni olish
  async getInfo() {
    return await this.infoRepo.find({
      order: { id: 'DESC' },
      take: 100,
    });
  }

  // Barcha Warn loglarni olish
  async getWarnings() {
    return await this.warnRepo.find({
      order: { id: 'DESC' },
      take: 100,
    });
  }
}