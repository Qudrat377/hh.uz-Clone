import { PartialType } from '@nestjs/mapped-types';
import { CreateSevedDto } from './create-seved.dto';

export class UpdateSevedDto extends PartialType(CreateSevedDto) {}
