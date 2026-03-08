import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { Repository } from 'typeorm';
import { Auth } from '../auth/entities/auth.entity';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
  ) {} 
  async create(jobId: number, userId: number, createReplyDto: CreateReplyDto): Promise<Reply | null> {
    const foundedUser = await this.authRepository.findOne({
      where: {id: userId}
    })
    
    if(!foundedUser) throw new NotFoundException("User not found")

    const foundedJob = await this.jobRepository.findOne({
      where: {id: jobId}
    })

    if(!foundedJob) throw new NotFoundException("Job not found")

    const foundedReply = await this.replyRepository.findOne({
      where: {
        author: { id: userId },
        job: { id: jobId }
      }
    });
    if (foundedReply) {
      throw new ConflictException("Siz bu ishga oldin topshirgansiz")
    }

    const newReply = await this.replyRepository.create({
      ...createReplyDto,
      author: foundedUser,
      job: foundedJob,
    })
    
    return await this.replyRepository.save(newReply)
  }

  async findMyReply(userId: number): Promise<Reply[]> {
    try {
      const reply = await this.replyRepository.find({
        where: {author: {id: userId}},
        relations: ["author"],
        order: { createdAt: "DESC" } // Yangilari tepada turishi uchuna
      })

      return reply
    } catch(error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findJobReplys(id: number, userId: number): Promise<Reply[]> {
    try {
      const reply = await this.replyRepository.find({
        where: {job: {id: id}},
        relations: ["author"],
        order: { createdAt: "DESC" } // Yangilari tepada turishi uchuna
      })

      return reply
    } catch(error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number): Promise<Reply> {
    try {
      const foundedReply = await this.replyRepository.findOne({
        where: {id}})

        if(!foundedReply) throw new NotFoundException("Reply not found")

        return foundedReply
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

async update(id: number, updateReplyDto: UpdateReplyDto): Promise<{message: string}> {
    try {
      const foundedReply = await this.replyRepository.findOne({
        where: {id}
      })

      if(!foundedReply) throw new NotFoundException("Job not found")

      await this.replyRepository.update(foundedReply.id, updateReplyDto)

      return {message: "Updeted job"}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async delete(id: number): Promise<{message: string}> {
    try {
      const foundedReply = await this.replyRepository.findOne({
        where: {id}
      })

      if (!foundedReply) throw new NotFoundException("Replay not found")     
      
      await this.replyRepository.delete(foundedReply.id)

      return {message: "Deleted reply"}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      const foundedJob = await this.replyRepository.findOne({
        where: {id}})

      if(!foundedJob) throw new NotFoundException("Job not found")

      await this.replyRepository.softDelete(foundedJob.id)

      return {message: "SoftDeleted reply"}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
