
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
import { Seved } from '../entities/seved.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Seved) private sevedRepository: Repository<Seved>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const sevedId = +request.params.id
       
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
        // const payload = await this.jwtService.verifyAsync(token);
        const seved = await this.sevedRepository.findOne({
            where: {id: sevedId},
            relations: ["author"]
        })

        if(!seved) throw new NotFoundException("Seved not found")            

        if(seved.author.id !== request["user"].id) throw new ForbiddenException("Sizga tegishli bo'lmagan maydonni o'zgartirmoqchisiz")

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
