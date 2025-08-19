import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserLearningPathDto } from './create-user-learning-path.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateUserLearningPathDto extends PartialType(CreateUserLearningPathDto) {
  @ApiPropertyOptional({
    description: 'Thời gian hoàn thành',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}
