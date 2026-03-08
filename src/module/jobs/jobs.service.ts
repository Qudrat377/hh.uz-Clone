import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "./entities/job.entity";
import { Repository } from "typeorm";
import { QueryJobDto } from "./dto/query.job.dto";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    private readonly logger: LoggerService, // Bizning servis
  ) {}

  // 1. O'zgaruvchini shu yerda e'lon qiling
  private readonly context = "JobsService";

  // create job
  async create(createJobDto: CreateJobDto, userId: any): Promise<Job> {
    try {
      const job = this.jobRepository.create({
        ...createJobDto,
        author: userId,
      });

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Yangi ish elon qilindi: Nomi ${createJobDto.workHeader}, Muallif ID: ${userId}`,
        this.context,
      );

      return await this.jobRepository.save(job);
    } catch (error) {
      this.logger.error(
        `Yangi ish elon qilishda xatolik: ${error.message}`,
        error.stack,
        this.context,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(query: QueryJobDto) {
    try {
      const { page = 1, limit = 10, search } = query;

      const queryBuilder = await this.jobRepository
        .createQueryBuilder("job")
        .leftJoinAndSelect("job.author", "author")
        .where("job.isActive = :isActive", { isActive: true })
        .where("job.deletedAt is null");

      if (search) {
        // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Ish qidirildi: Nomi ${search}`,
        this.context,
      );
        if (search) {
          queryBuilder.andWhere(
            ` (
                job."workHeader"::text ILIKE :search OR 
                job."workGrafik" ILIKE :search OR 
                job."fromSalary" ILIKE :search OR 
                job."toSalary" ILIKE :search OR 
                job."cauntry"::text ILIKE :search OR 
                job."city"::text ILIKE :search OR 
                job."work_years"::text ILIKE :search OR 
                job."position"::text ILIKE :search
              ) `,
            { search: `%${search}%` },
          );
        }
      }

      const total = await queryBuilder.getCount();

      const result = await queryBuilder
        .orderBy("job.createdAt", "DESC")
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        next: total > page * limit ? { page: page + 1 } : undefined,
        prev: page > 1 ? { page: page - 1, limit } : undefined,
        totalPage: Math.ceil(total / limit),
        result,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findMyJobs(userId: number): Promise<Job[]> {
    try {
      const job = await this.jobRepository.find({
        where: { author: { id: userId } },
        relations: ["author"],
        order: { createdAt: "DESC" }, // Yangilari tepada turishi uchuna
      });

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Muallif ID: ${userId} o'z ishlarini so'radi`,
        this.context,
      );

      return job;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Job> {
    try {
      const foundedJob = await this.jobRepository.findOne({
        where: { id },
      });

      if (!foundedJob) throw new NotFoundException("Job not found");

      return foundedJob;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateJobDto: UpdateJobDto,
  ): Promise<{ message: string }> {
    try {
      const foundedJob = await this.jobRepository.findOne({
        where: { id },
      });

      if (!foundedJob) throw new NotFoundException("Job not found");

      await this.jobRepository.update(foundedJob.id, updateJobDto);

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Yangi ish yaratildi: Nomi ${updateJobDto?.workHeader}, Muallif ID: ${foundedJob.id}`,
        this.context,
      );

      return { message: "Updeted job" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: number, userId: number): Promise<{ message: string }> {
    try {
      const foundedJob = await this.jobRepository.findOne({
        where: { id },
      });

      if (!foundedJob) throw new NotFoundException("Job not found");

      await this.jobRepository.delete(foundedJob.id);

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `ish o'chirildi:, Muallif ID: ${userId}`,
        this.context,
      );

      return { message: "Deleted job" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    try {
      const foundedJob = await this.jobRepository.findOne({
        where: { id },
      });

      if (!foundedJob) throw new NotFoundException("Job not found");

      // 1. Muvaffaqiyatli amal uchun INFO log
      this.logger.log(
        `Ish o'chirildo: Nomi ${foundedJob?.workHeader}, Muallif ID: ${userId}`,
        this.context,
      );

      await this.jobRepository.softDelete(foundedJob.id);

      return { message: "SoftDeleted job" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
