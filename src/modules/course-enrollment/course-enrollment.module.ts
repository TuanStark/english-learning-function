import { Module } from '@nestjs/common';
import { CourseEnrollmentService } from './course-enrollment.service';
import { CourseEnrollmentController } from './course-enrollment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseEnrollmentController],
  providers: [CourseEnrollmentService],
  exports: [CourseEnrollmentService]
})
export class CourseEnrollmentModule {}
