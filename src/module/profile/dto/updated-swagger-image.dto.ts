import { ApiProperty } from "@nestjs/swagger";
import { UpdateProfileDto } from "./update-profile.dto";

export class UpdateProfileSwaggerDto extends UpdateProfileDto {
    @ApiProperty({type: "string", format: "binary"})
    file: any;
}