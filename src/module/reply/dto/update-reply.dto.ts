// import { PartialType } from '@nestjs/mapped-types';
// import { CreateReplyDto } from './create-reply.dto';

// export class UpdateReplyDto extends PartialType(CreateReplyDto) {}

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateReplyDto {
  @IsString()
  @ApiPropertyOptional({
    default:
      "Men nodejs dasturchiman sizning ishingizga qiziqish bildirmoqdaman",
  })
  message?: string;
}
