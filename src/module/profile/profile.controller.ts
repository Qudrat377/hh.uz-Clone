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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guard/auth.guard";
import { UpdateProfileSwaggerDto } from "./dto/updated-swagger-image.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import { OwnerGuard } from "./guards/owner-guard";
import { ResumeDto } from "./dto/resume-profile.dto";

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@ApiTags("Profile")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(OwnerGuard)
  @ApiOperation({ description: "Resume api (owner)" })
  @ApiBody({ type: ResumeDto })
  @ApiNotFoundResponse({ description: "Profile not found" })
  @ApiOkResponse({ description: "Added resume" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueName = `${file.fieldname}${Math.random() * 1e9}`;
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  )
  @Post("upload_resume")
  create(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.profileService.create(req.user.id, file);
  }

  // deleted resume 
  @UseGuards(OwnerGuard)
  @ApiOperation({ description: "Deleted profile resume api (owner)" })
  @ApiNotFoundResponse({ description: "Profile not found" })
  @ApiOkResponse({ description: "Deleted resume" })
  @Delete("resume")
  deletedResume(@Req() req) {
    return this.profileService.deletedResume(req.user.id);
  }

  // @Get()
  // findAll() {
  //   return this.profileService.findAll();
  // }

  // myProfile
  @UseGuards(OwnerGuard)
  @ApiOperation({ description: "Get profile api (public)" })
  @ApiOkResponse({ description: "My profile" })
  @Get("my_profile")
  findOne(@Req() req) {
    return this.profileService.myProfile(req.user.id);
  }

  // update profile
  @UseGuards(OwnerGuard)
  @ApiOperation({ description: "Update profile api (owner)" })
  @ApiBody({ type: UpdateProfileSwaggerDto })
  @ApiNotFoundResponse({ description: "Profile not found" })
  @ApiOkResponse({ description: "Updated profile" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueName = `${file.fieldname}${Math.random() * 1e9}`;
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  )
  @Patch("update_profil_and_image")
  update(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateProfile(
      req.user.id,
      updateProfileDto,
      file,
    );
  }

  // deleted image 
  @UseGuards(OwnerGuard)
  @ApiOperation({ description: "Deleted profile image api (owner)" })
  @ApiNotFoundResponse({ description: "Profile not found" })
  @ApiOkResponse({ description: "Deleted image" })
  @Delete("image")
  remove(@Req() req) {
    return this.profileService.remove(req.user.id);
  }
}
