import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindAllDto } from '../../../common/global/find-all.dto';

export class FindAllGrammarDto extends FindAllDto {
  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsBoolean()
  includeInactive?: boolean;
}
