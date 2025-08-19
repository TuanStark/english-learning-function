import { Module } from '@nestjs/common';
import { VocabularyExampleService } from './vocabulary-example.service';
import { VocabularyExampleController } from './vocabulary-example.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VocabularyExampleController],
  providers: [VocabularyExampleService],
  exports: [VocabularyExampleService],
})
export class VocabularyExampleModule {}
