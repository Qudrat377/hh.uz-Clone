import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateAuthDto, LoginAuthDto } from "./dto/create-auth.dto";
import { AuthGuard } from "@nestjs/passport";
import { VerifyAuthDto } from "./dto/verify.dto";
import { QueryDto } from "./dto/query.dto";

@ApiBearerAuth("JWT-auth")
@ApiTags("Auth")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
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
    return this.authService.googleLogin(req.user);
  }

  // github
  @Get("github")
  @UseGuards(AuthGuard("github"))
  authGithub() {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  githubRedirect(@Request() req: any) {
    return this.authService.githubLogin(req.user);
  }

  // register
  @ApiOperation({ description: "Register api (public" })
  @ApiCreatedResponse({ description: "Registered new user" })
  @ApiBadRequestResponse({ description: "User already exists" })
  @ApiBody({ type: CreateAuthDto })
  @HttpCode(200)
  @Post("register")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  // verify 
  @ApiOperation({ description: "Verify api (public)" })
  @ApiOkResponse({ description: "Token" })
  @ApiBadRequestResponse({ description: "User not found" })
  @ApiBody({ type: VerifyAuthDto })
  @HttpCode(200)
  @Post("verify")
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.verify(verifyAuthDto);
  }

  // login 
  @ApiOperation({description: "Login api (public)"})
  @ApiOkResponse({description: "Send email code"})
  @ApiUnauthorizedResponse({description: "User not found"})
  @HttpCode(200)
  @Post("login")
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  // findAll 
  @ApiOperation({description: "Get All users api (public)"})
  @ApiOkResponse({description: "list of users"})
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.authService.findAllUser(query);
  }

  // delete 
  @ApiOperation({description: "Delete article api (owner)"})
  @ApiNotFoundResponse({description: "User not found"})
  @ApiOkResponse({description: "Deleted user"})
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @Req() req) {
    return this.authService.deleteUser(+id);
  }
}
