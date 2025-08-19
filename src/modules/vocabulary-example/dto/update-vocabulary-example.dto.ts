import { PartialType } from '@nestjs/swagger';
import { CreateVocabularyExampleDto } from './create-vocabulary-example.dto';

export class UpdateVocabularyExampleDto extends PartialType(CreateVocabularyExampleDto) {}
