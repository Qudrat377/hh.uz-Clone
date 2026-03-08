import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyAuthDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({default: "assomad377@gmail.com"})
    email: string;

    @IsString()
    @ApiProperty({default: "123456"})
    @Length(6, 6)
    otp: string;
}
