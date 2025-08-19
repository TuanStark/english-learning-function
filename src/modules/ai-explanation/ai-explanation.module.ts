import { Module } from '@nestjs/common';
import { AIExplanationService } from './ai-explanation.service';
import { AIExplanationController } from './ai-explanation.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AIExplanationController],
  providers: [AIExplanationService],
  exports: [AIExplanationService],
})
export class AIExplanationModule {}
