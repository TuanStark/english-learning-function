import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { CreateUserGrammarProgressDto } from './create-user-grammar-progress.dto';

export class UpdateUserGrammarProgressDto extends PartialType(CreateUserGrammarProgressDto) {
  @ApiPropertyOptional({
    description: 'Lần luyện tập cuối cùng',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  lastPracticedAt?: Date;
}
