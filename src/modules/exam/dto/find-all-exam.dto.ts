import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindAllDto } from '../../../common/global/find-all.dto';

export class FindAllExamDto extends FindAllDto {
  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsBoolean()
  includeInactive?: boolean;

  @IsOptional()
  @IsString()
  type?: string;
}
