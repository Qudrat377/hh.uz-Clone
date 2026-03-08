import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
} from "@nestjs/common";
import { LoggerService } from "./logger.service";
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorators/roles,decorator";
import { UserRole } from "src/shared/constants/enum/user.role";

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard, RolesGuard) // Loglarni ko'rish uchun ham auth, ham role guard kerak
// @Roles(UserRole.ADMIN) // Loglarni faqat ADMIN ko'ra olsin
@ApiTags("Logger")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("logger")
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @ApiOperation({ summary: "Get all error logs" })
  @ApiOkResponse({ description: "List of error logs" })
  @Get("errors")
  async findAllErrors() {
    return await this.loggerService.getErrors();
  }

  @ApiOperation({ summary: "Get all info logs" })
  @ApiOkResponse({ description: "List of info logs" })
  @Get("info")
  async findAllInfo() {
    return await this.loggerService.getInfo();
  }

  @ApiOperation({ summary: "Get all warning logs" })
  @ApiOkResponse({ description: "List of warning logs" })
  @Get("warnings")
  async findAllWarnings() {
    return await this.loggerService.getWarnings();
  }

  // @ApiOperation({ summary: "Clear logs by type" })
  // @ApiParam({ name: "type", enum: ['error', 'info', 'warn'], description: "Log turi" })
  // @ApiOkResponse({ description: "Logs cleared successfully" })
  // @Delete("clear/:type")
  // async clearLogs(@Param("type") type: 'error' | 'info' | 'warn') {
  //   return await this.loggerService.clearAllLogs(type);
  // }
}
// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { LoggerService } from './logger.service';
// import { CreateLoggerDto } from './dto/create-logger.dto';
// import { UpdateLoggerDto } from './dto/update-logger.dto';

// @Controller('logger')
// export class LoggerController {
//   constructor(private readonly loggerService: LoggerService) {}

//   // @Post()
//   // create(@Body() createLoggerDto: CreateLoggerDto) {
//   //   return this.loggerService.create(createLoggerDto);
//   // }

//   // @Get()
//   // findAll() {
//   //   return this.loggerService.findAll();
//   // }

//   // @Get(':id')
//   // findOne(@Param('id') id: string) {
//   //   return this.loggerService.findOne(+id);
//   // }

//   // @Patch(':id')
//   // update(@Param('id') id: string, @Body() updateLoggerDto: UpdateLoggerDto) {
//   //   return this.loggerService.update(+id, updateLoggerDto);
//   // }

//   // @Delete(':id')
//   // remove(@Param('id') id: string) {
//   //   return this.loggerService.remove(+id);
//   // }
// }
