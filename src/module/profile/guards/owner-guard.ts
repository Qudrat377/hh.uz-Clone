
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
import { Profile } from '../entities/profile.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const profileId = +request.user.id
       
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
        // const payload = await this.jwtService.verifyAsync(token);
        const profile = await this.profileRepository.findOne({
            where: {id: profileId},
            relations: ["auth"]
        })

        if(!profile) throw new NotFoundException("Job not found")            

        if(profile.auth.id !== request["user"].id) throw new ForbiddenException("Sizga tegishli bo'lmagan maydonni o'zgartirmoqchisiz")

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
