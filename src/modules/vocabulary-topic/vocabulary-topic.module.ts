import { Module } from '@nestjs/common';
import { VocabularyTopicService } from './vocabulary-topic.service';
import { VocabularyTopicController } from './vocabulary-topic.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VocabularyTopicController],
  providers: [VocabularyTopicService],
  exports: [VocabularyTopicService],
})
export class VocabularyTopicModule {}
