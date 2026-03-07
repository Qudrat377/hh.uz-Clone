
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const jobId = +request.params.id
       
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
        // const payload = await this.jwtService.verifyAsync(token);
        const job = await this.jobRepository.findOne({
            where: {id: jobId},
            relations: ["author"]
        })

        if(!job) throw new NotFoundException("Job not found")            

        if(job.author.id !== request["user"].id) throw new ForbiddenException("Sizga tegishli bo'lmagan maydonni o'zgartirmoqchisiz")

    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
