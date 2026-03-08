import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { SevedService } from "./seved.service";
import { CreateSevedDto } from "./dto/create-seved.dto";
import { UpdateSevedDto } from "./dto/update-seved.dto";
import { RolesGuard } from "src/common/guard/roles.guard";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guard/auth.guard";
import { OwnerGuard } from "./guards/owner-guard";
import { UserRole } from "src/shared/constants/enum/user.role";
import { Roles } from "src/common/decorators/roles,decorator";

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@ApiTags("Saved")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("seved")
export class SevedController {
  constructor(private readonly sevedService: SevedService) {}

  // addseved
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({ description: "Create seved api (public)" })
  @ApiCreatedResponse({ description: "Created seved" })
  @Post(":id")
  create(@Req() req, @Param("id") id: string) {
    return this.sevedService.create(+id, req.user.id);
  }

  // my replays
  @UseGuards(RolesGuard)
  @ApiOperation({ description: "Get All my seved api (owner)" })
  @ApiOkResponse({ description: "list of seved" })
  @Get("my-seveds")
  findMySeveds(@Req() req) {
    return this.sevedService.findMySeveds(req.user.id);
  }

  // delete
  @UseGuards(OwnerGuard)
  @ApiOperation({ description: "Delete seved api (owner)" })
  @ApiNotFoundResponse({ description: "Seved not found" })
  @ApiOkResponse({ description: "Deleted seved" })
  @Delete("delete:id")
  delete(@Param("id") id: string) {
    return this.sevedService.delete(+id);
  }
}
