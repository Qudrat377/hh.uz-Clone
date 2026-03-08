import { IsString, IsOptional, IsNotEmpty, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "src/shared/constants/enum/user.role";

export class ProfileBaseDto {
  @IsString({ message: "string bo'lishi kerak" })
  @Length(3, 50)
  @ApiPropertyOptional({ default: "ali" })
  lastName?: string;

  //   @ApiPropertyOptional({ default: "https://photo.com/me.jpg" })
  //   @IsOptional()
  //   @IsString()
  //   avatarUrl?: string;

  @IsString({ message: "string bo'lishi kerak" })
  @Length(3, 50)
  @ApiProperty({ default: "ali" })
  firstName: string;

  // --- Ixtiyoriy maydon ---
  @IsOptional() // Agar ma'lumot kelmasa, validator xato bermaydi
  @IsString()
  @ApiPropertyOptional({
    // Swagger'da qizil yulduzcha olib tashlanadi
    default: "Toshkent",
    description: "Foydalanuvchi yashash manzili (ixtiyoriy)",
  })
  from?: string; // "?" belgisi TypeScript'da bu maydon bo'lmasligi mumkinligini bildiradi
}
