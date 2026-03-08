
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
import { Reply } from '../entities/reply.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const replyId = +request.params.id
       
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
        // const payload = await this.jwtService.verifyAsync(token);
        const reply = await this.replyRepository.findOne({
            where: {id: replyId},
            relations: ["author"]
        })

        if(!reply) throw new NotFoundException("Job not found")            

        if(reply.author.id !== request["user"].id) throw new ForbiddenException("Sizga tegishli bo'lmagan maydonni o'zgartirmoqchisiz")

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
