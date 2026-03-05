import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiBearerAuth("JWT-auth")
@ApiTags("Auth")
@ApiInternalServerErrorResponse({description: "Internal server error"})
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // google
  @Get("google")
  @UseGuards(AuthGuard("google"))
  authGoogle() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleRedirect(@Request() req: any) {
    return this.authService.googleLogin(req.user)
  }

  // github
  @Get("github")
  @UseGuards(AuthGuard("github"))
  authGithub() {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  githubRedirect(@Request() req: any) {
    return this.authService.googleLogin(req.user)
  }

    // register 
    @ApiOperation({description: "Register api (public"})
    @ApiCreatedResponse({description: "Registered new user"})
    @ApiBadRequestResponse({description: "User already exists"})
    @ApiBody({type: CreateAuthDto})
    @HttpCode(200)
    @Post("register")
    create(@Body() createAuthDto: CreateAuthDto) {
        return this.authService.register(createAuthDto)
    }
}