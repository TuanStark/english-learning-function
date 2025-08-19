import { Module } from '@nestjs/common';
import { VocabulariesService } from './vocabularies.service';
import { VocabulariesController } from './vocabularies.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VocabulariesController],
  providers: [VocabulariesService],
  exports: [VocabulariesService],
})
export class VocabulariesModule {}
