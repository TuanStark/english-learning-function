import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindAllDto } from '../../../common/global/find-all.dto';

export class FindAllQuestionDto extends FindAllDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsInt()
  examId?: number;

  @IsOptional()
  @IsString()
  questionType?: string;
}
