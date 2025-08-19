import { Module } from '@nestjs/common';
import { UserLearningPathService } from './user-learning-path.service';
import { UserLearningPathController } from './user-learning-path.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserLearningPathController],
  providers: [UserLearningPathService],
  exports: [UserLearningPathService],
})
export class UserLearningPathModule {}
