import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { UzbekistanCity } from "src/shared/constants/enum/city";
import { Cauntry } from "src/shared/constants/enum/country";
import { Position } from "src/shared/constants/enum/position";
import { WorkHeader } from "src/shared/constants/enum/work.title";
import { WorkYears } from "src/shared/constants/enum/work.years";

export class CreateJobDto {
  @IsEnum(WorkHeader)
  @ApiProperty({ enum: WorkHeader, default: "PROGRAMMER" })
  workHeader: WorkHeader;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      "Ushbu lavozimda siz NestJS yordamida backend tizimlarini ishlab chiqasiz...",
    description: "Ish haqida to'liq batafsil ma'lumot",
  })
  workDescription: string;

  @IsString()
  @Length(1, 250)
  @ApiProperty({ default: "1-5" })
  workGrafik: string;

  @IsArray() // jsonb uchun massiv kutamiz
  @IsOptional()
  @ApiProperty({ default: ["Node.js tajribasi", "Rus tili bilimi"] })
  requirements: any[];

  @IsArray() // jsonb uchun massiv kutamiz
  @IsOptional()
  @ApiProperty({ default: ["Siz o'zingiz tanlaysiz qachon ishlashni"] })
  advantages: any[];

  @IsString()
  @Length(1, 250)
  @ApiProperty({ default: "790" })
  fromSalary: string;

  @IsString()
  @Length(1, 250)
  @ApiProperty({ default: "1500" })
  toSalary: string;

  @IsEnum(Cauntry)
  @ApiProperty({ enum: Cauntry, default: "uzbekistan" })
  cauntry: Cauntry;

  @IsEnum(UzbekistanCity)
  @ApiProperty({ enum: UzbekistanCity, default: "toshkent" })
  city: UzbekistanCity;

  @IsEnum(WorkYears)
  @ApiProperty({ enum: WorkYears, default: "1 dan 3 yilgacha" })
  work_years: WorkYears;

  @IsEnum(Position)
  @ApiProperty({ enum: Position, default: "middle" })
  position: Position;
}
