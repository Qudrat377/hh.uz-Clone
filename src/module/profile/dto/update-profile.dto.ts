import { IsString, IsOptional, IsUrl } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiPropertyOptional({ default: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ default: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  // @ApiPropertyOptional({ default: '' })
  // @IsOptional()
  // @IsUrl()
  // avatarUrl?: string;

  @ApiPropertyOptional({ default: 'tashkent' })
  @IsOptional()
  @IsString()
  from?: string;

  // @ApiPropertyOptional({ default: '41.2995' })
  // @IsOptional()
  // @IsString()
  // latitude?: string;

  // @ApiPropertyOptional({ default: '69.2401' })
  // @IsOptional()
  // @IsString()
  // longitude?: string;

  // @ApiPropertyOptional({ default: 'https://resume.com/my-cv.pdf' })
  // @IsOptional()
  // @IsString()
  // resume?: string;
}