import { IsOptional, IsString } from "class-validator";
import { FindAllDto } from "src/common/global/find-all.dto";

export class FindAllTopicsDto extends FindAllDto {
  @IsOptional()
  @IsString()
  topicName?: string;
}   