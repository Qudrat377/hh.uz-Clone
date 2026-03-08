import { ApiProperty } from "@nestjs/swagger";

export class ResumeDto {
    @ApiProperty({type: "string", format: "binary"})
    file: any;
}