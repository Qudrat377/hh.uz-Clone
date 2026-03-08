import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ReplyService } from "./reply.service";
import { CreateReplyDto } from "./dto/create-reply.dto";
import { UpdateReplyDto } from "./dto/update-reply.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorators/roles,decorator";
import { UserRole } from "src/shared/constants/enum/user.role";
import { OwnerGuard } from "./guards/owner-guard";

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@ApiTags("reply")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("reply")
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  // addReply
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({ description: "Create reply api (public)" })
  @ApiBody({ type: CreateReplyDto })
  @ApiCreatedResponse({ description: "Created reply" })
  @Post(":id")
  create(
    @Req() req,
    @Param("id") id: string,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return this.replyService.create(+id, req.user.id, createReplyDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({ description: "Get All my reply api (owner)" })
  @ApiOkResponse({ description: "list of reply" })
  @Get("my-replys")
  findAll(@Req() req) {
    return this.replyService.findMyReply(req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({ description: "Get All my reply api (owner)" })
  @ApiOkResponse({ description: "list of reply" })
  @Get("job_replys:id")
  findJobReplys(@Param("id") id: string, @Req() req) {
    return this.replyService.findJobReplys(+id, req.user.id);
  }

  // get one reply
  @ApiOperation({ description: "Get one reply api (public)" })
  @ApiNotFoundResponse({ description: "Reply not found" })
  @ApiOkResponse({ description: "GEt one reply" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.replyService.findOne(+id);
  }

  // updated
  @UseGuards(RolesGuard, OwnerGuard) //
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({ description: "Update reply api (owner)" })
  @ApiBody({ type: UpdateReplyDto })
  @ApiNotFoundResponse({ description: "Reply not found" })
  @ApiOkResponse({ description: "Updated reply" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateReplyDto: UpdateReplyDto) {
    return this.replyService.update(+id, updateReplyDto);
  }

  // delete
  @UseGuards(RolesGuard, OwnerGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({ description: "Delete reply api (owner)" })
  @ApiNotFoundResponse({ description: "Reply not found" })
  @ApiOkResponse({ description: "Deleted reply" })
  @Delete("delete:id")
  delete(@Param("id") id: string) {
    return this.replyService.delete(+id);
  }

  // delete
  @UseGuards(RolesGuard, OwnerGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({ description: "Delete reply api (owner)" })
  @ApiNotFoundResponse({ description: "Reply not found" })
  @ApiOkResponse({ description: "SoftDeleted reply" })
  @Delete("soft_delet:id")
  remove(@Param("id") id: string) {
    return this.replyService.remove(+id);
  }
}
