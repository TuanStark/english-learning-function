import { Module } from '@nestjs/common';
import { CourseLessonService } from './course-lesson.service';
import { CourseLessonController } from './course-lesson.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseLessonController],
  providers: [CourseLessonService],
  exports: [CourseLessonService]
})
export class CourseLessonModule {}
