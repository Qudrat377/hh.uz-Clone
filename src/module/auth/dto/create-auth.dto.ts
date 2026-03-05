import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";
import { UserRole } from "src/shared/constants/user.role";

export class CreateAuthDto {
    @IsString({message: "string bo'lishi kerak"})
    @Length(3, 50)
    @ApiProperty({default: "ali"})
    firstName: string;

    @IsString()
    @IsEmail()
    @ApiProperty({default: "assomad377@gmail.com"})
    email: string;

    @IsString()
    @ApiProperty({default: "7777"})
    password: string;

    @IsString()
    @ApiProperty({default: "candidate"})
    role: UserRole;

    // --- Ixtiyoriy maydon ---
    @IsOptional() // Agar ma'lumot kelmasa, validator xato bermaydi
    @IsString()
    @ApiPropertyOptional({ // Swagger'da qizil yulduzcha olib tashlanadi
        default: "Toshkent",
        description: "Foydalanuvchi yashash manzili (ixtiyoriy)"
    })
    from?: string; // "?" belgisi TypeScript'da bu maydon bo'lmasligi mumkinligini bildiradi

    // @IsString()
    // @ApiProperty({default: "Toshkent"})
    // from: string;
}

export class LoginAuthDto {
    @IsString()
    @IsEmail()
    @ApiProperty({default: "assomad377@gmail.com"})
    email: string;

    @IsString()
    @ApiProperty({default: "7777"})
    password: string;
}

