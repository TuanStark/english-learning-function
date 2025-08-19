import { PartialType } from '@nestjs/swagger';
import { CreateAIExplanationDto } from './create-ai-explanation.dto';

export class UpdateAIExplanationDto extends PartialType(CreateAIExplanationDto) {}
