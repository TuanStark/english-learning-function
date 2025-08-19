import { PartialType } from '@nestjs/swagger';
import { CreatePathStepDto } from './create-path-step.dto';

export class UpdatePathStepDto extends PartialType(CreatePathStepDto) {}
