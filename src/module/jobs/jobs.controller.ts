import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryJobDto } from './dto/query.job.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles,decorator';
import { UserRole } from 'src/shared/constants/enum/user.role';
import { OwnerGuard } from './guards/owner-guard';

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@ApiTags("Job")
@ApiInternalServerErrorResponse({description: "Internal server error"})
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // addJob
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({description: "Create job api (public)"})
  @ApiBody({type: CreateJobDto})
  @ApiCreatedResponse({description: "Created job"})
  @Post()
  create(@Body() createJobDto: CreateJobDto, @Req() req) {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  // findAllJobs
  @ApiOperation({description: "Get all jobs api (public)"})
  @ApiOkResponse({description: "list of jobs"})
  @Get()
  findAll(@Query() query: QueryJobDto) {
    return this.jobsService.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({description: "Get All my job api (owner)"})
  @ApiOkResponse({description: "list of job"})
  @Get("my-job")
  findAllMyArticles(@Req() req) {
    return this.jobsService.findMyJobs(req.user.id);
  }

  // get one job 
  @ApiOperation({description: "Get one job api (public)"})
  @ApiNotFoundResponse({description: "Job not found"})
  @ApiOkResponse({description: "GEt one job"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  // updated 
  @UseGuards(RolesGuard, OwnerGuard) //
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({description: "Update job api (owner)"})
  @ApiBody({type: UpdateJobDto})
  @ApiNotFoundResponse({description: "Job not found"})
  @ApiOkResponse({description: "Updated job"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  // delete 
  @UseGuards(RolesGuard, OwnerGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({description: "Delete job api (owner)"})
  @ApiNotFoundResponse({description: "Job not found"})
  @ApiOkResponse({description: "Deleted job"})
  @Delete('delete:id')
  delete(@Param('id') id: string, @Req() req) {
    return this.jobsService.delete(+id, req.user.id);
  }
  
  // delete 
  @UseGuards(RolesGuard, OwnerGuard)
  @Roles(UserRole.EMPLOYER, UserRole.USER, UserRole.CANDIDATE)
  @ApiOperation({description: "Delete job api (owner)"})
  @ApiNotFoundResponse({description: "Job not found"})
  @ApiOkResponse({description: "SoftDeleted job"})
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.jobsService.remove(+id, req.user.id);
  }
}
