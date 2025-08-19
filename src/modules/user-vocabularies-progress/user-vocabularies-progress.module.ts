import { Module } from '@nestjs/common';
import { UserVocabulariesProgressService } from './user-vocabularies-progress.service';
import { UserVocabulariesProgressController } from './user-vocabularies-progress.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserVocabulariesProgressController],
  providers: [UserVocabulariesProgressService],
  exports: [UserVocabulariesProgressService],
})
export class UserVocabulariesProgressModule {}
