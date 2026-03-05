import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Global() // Bu modulni hamma joyda ishlatish uchun Global qilamiz
@Module({
  imports: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}