import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { CreateUserVocabulariesProgressDto } from './create-user-vocabularies-progress.dto';

export class UpdateUserVocabulariesProgressDto extends PartialType(CreateUserVocabulariesProgressDto) {
  @ApiPropertyOptional({
    description: 'Lần luyện tập cuối cùng',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  lastPracticedAt?: Date;
}
