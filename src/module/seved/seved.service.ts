import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Seved } from "./entities/seved.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "../jobs/entities/job.entity";
import { Auth } from "../auth/entities/auth.entity";
import { Repository } from "typeorm";

@Injectable()
export class SevedService {
  constructor(
    @InjectRepository(Seved) private sevedRepository: Repository<Seved>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
  ) {}

  // add seved
  async create(sevedId: number, userId: number): Promise<Seved | null> {
    const foundedUser = await this.authRepository.findOne({
      where: { id: userId },
    });

    if (!foundedUser) throw new NotFoundException("User not found");

    const foundedJob = await this.jobRepository.findOne({
      where: { id: sevedId },
    });

    if (!foundedJob) throw new NotFoundException("Job not found");

    const foundedReply = await this.sevedRepository.findOne({
      where: {
        author: { id: userId },
        jobs: { id: sevedId },
      },
    });
    if (foundedReply) {
      throw new ConflictException("Siz bu ishga oldin topshirgansiz");
    }

    const newReply = await this.sevedRepository.create({
      author: foundedUser,
      jobs: foundedJob,
    });

    return await this.sevedRepository.save(newReply);
  }

  // my seveds
  async findMySeveds(userId: number): Promise<Seved[]> {
    try {
      const reply = await this.sevedRepository.find({
        where: { author: { id: userId } },
        relations: ["author"],
        order: { createdAt: "DESC" }, // Yangilari tepada turishi uchuna
      });

      return reply;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // deleted seved
  async delete(id: number): Promise<{ message: string }> {
    try {
      const foundedSeved = await this.sevedRepository.findOne({
        where: { id },
      });

      if (!foundedSeved) throw new NotFoundException("Seved not found");

      await this.sevedRepository.delete(foundedSeved.id);

      return { message: "Deleted seved" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
