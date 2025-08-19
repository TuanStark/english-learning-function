import { Module } from '@nestjs/common';
import { PathStepService } from './path-step.service';
import { PathStepController } from './path-step.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PathStepController],
  providers: [PathStepService],
  exports: [PathStepService],
})
export class PathStepModule {}
