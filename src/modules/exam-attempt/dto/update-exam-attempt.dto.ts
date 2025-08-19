import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { CreateExamAttemptDto } from './create-exam-attempt.dto';

export class UpdateExamAttemptDto extends PartialType(CreateExamAttemptDto) {
  @ApiPropertyOptional({
    description: 'Thời gian hoàn thành',
    example: '2024-01-01T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}
