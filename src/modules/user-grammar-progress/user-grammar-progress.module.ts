import { Module } from '@nestjs/common';
import { UserGrammarProgressService } from './user-grammar-progress.service';
import { UserGrammarProgressController } from './user-grammar-progress.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserGrammarProgressController],
  providers: [UserGrammarProgressService],
  exports: [UserGrammarProgressService],
})
export class UserGrammarProgressModule {}
