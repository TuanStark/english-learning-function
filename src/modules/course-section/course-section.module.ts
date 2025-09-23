import { Module } from '@nestjs/common';
import { CourseSectionService } from './course-section.service';
import { CourseSectionController } from './course-section.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseSectionController],
  providers: [CourseSectionService],
  exports: [CourseSectionService]
})
export class CourseSectionModule {}
