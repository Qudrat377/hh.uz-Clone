import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class VerifyAuthDto {
    @IsString()
    @IsEmail()
    @ApiProperty({default: "assomad377@gmail.com"})
    email: string;

    @IsString()
    @ApiProperty({default: "123456"})
    otp: string;
}