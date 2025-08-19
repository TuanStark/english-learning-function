import { PartialType } from '@nestjs/swagger';
import { CreateVocabularyTopicDto } from './create-vocabulary-topic.dto';

export class UpdateVocabularyTopicDto extends PartialType(CreateVocabularyTopicDto) {}
