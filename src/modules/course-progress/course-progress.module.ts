import { Module } from '@nestjs/common';
import { CourseProgressService } from './course-progress.service';
import { CourseProgressController } from './course-progress.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseProgressController],
  providers: [CourseProgressService],
  exports: [CourseProgressService]
})
export class CourseProgressModule {}
