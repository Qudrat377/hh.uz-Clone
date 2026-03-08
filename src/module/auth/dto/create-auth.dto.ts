import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/shared/constants/enum/user.role";
import { ProfileBaseDto } from "src/module/profile/dto/profile-base.dto";

export class CreateAuthDto extends ProfileBaseDto {
  //   ------------------
  @IsString()
  @IsEmail()
  @ApiProperty({ default: "assomad377@gmail.com" })
  email: string;

  @IsString()
  @ApiProperty({ default: "7777" })
  password: string;

  @IsString()
  @ApiProperty({ default: "candidate" })
  role: UserRole;
}

export class LoginAuthDto {
  @ApiProperty({ default: "assomad377@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: "7777" })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResentOtpAuthDto {
  @ApiProperty({ default: "assomad377@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordAuthDto {
  @ApiProperty({ default: "assomad377@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @ApiProperty({ default: "123456" })
  @Length(6, 6)
  otp: string;

  @ApiProperty({ default: "7777" })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
// ------------o'zimni kodlarim

// import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
// import { IsEmail, IsOptional, IsString, Length } from "class-validator";
// import { UserRole } from "src/shared/constants/enum/user.role";

// export class CreateAuthDto {
//     @IsString({message: "string bo'lishi kerak"})
//     @Length(3, 50)
//     @ApiProperty({default: "ali"})
//     firstName: string;

//     @IsString()
//     @IsEmail()
//     @ApiProperty({default: "assomad377@gmail.com"})
//     email: string;

//     @IsString()
//     @ApiProperty({default: "7777"})
//     password: string;

//     @IsString()
//     @ApiProperty({default: "candidate"})
//     role: UserRole;

//     // --- Ixtiyoriy maydon ---
//     @IsOptional() // Agar ma'lumot kelmasa, validator xato bermaydi
//     @IsString()
//     @ApiPropertyOptional({ // Swagger'da qizil yulduzcha olib tashlanadi
//         default: "Toshkent",
//         description: "Foydalanuvchi yashash manzili (ixtiyoriy)"
//     })
//     from?: string; // "?" belgisi TypeScript'da bu maydon bo'lmasligi mumkinligini bildiradi

//     // @IsString()
//     // @ApiProperty({default: "Toshkent"})
//     // from: string;
// }

// export class LoginAuthDto {
//     @IsString()
//     @IsEmail()
//     @ApiProperty({default: "assomad377@gmail.com"})
//     email: string;

//     @IsString()
//     @ApiProperty({default: "7777"})
//     password: string;
// }
