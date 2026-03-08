import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateReplyDto {
  @IsString()
  @ApiPropertyOptional({
    default:
      "Men nodejs dasturchiman sizning ishingizga qiziqish bildirmoqdaman",
  })
  message?: string;
}
