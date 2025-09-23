import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { CourseEnrollmentService } from './course-enrollment.service';
import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';
import { UpdateCourseEnrollmentDto } from './dto/update-course-enrollment.dto';
import { QueryCourseEnrollmentDto } from './dto/query-course-enrollment.dto';

@Controller('course-enrollments')
export class CourseEnrollmentController {
  constructor(private readonly courseEnrollmentService: CourseEnrollmentService) {}

  @Post()
  create(@Body() createCourseEnrollmentDto: CreateCourseEnrollmentDto) {
    return this.courseEnrollmentService.create(createCourseEnrollmentDto);
  }

  @Get()
  findAll(@Query() query: QueryCourseEnrollmentDto) {
    return this.courseEnrollmentService.findAll(query);
  }

  @Get('stats')
  getStats(@Query('courseId') courseId?: string) {
    const courseIdNumber = courseId ? parseInt(courseId, 10) : undefined;
    return this.courseEnrollmentService.getEnrollmentStats(courseIdNumber);
  }

  @Get('user/:userId/course/:courseId')
  findByUserAndCourse(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('courseId', ParseIntPipe) courseId: number
  ) {
    return this.courseEnrollmentService.findByUserAndCourse(userId, courseId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseEnrollmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseEnrollmentDto: UpdateCourseEnrollmentDto
  ) {
    return this.courseEnrollmentService.update(id, updateCourseEnrollmentDto);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.courseEnrollmentService.complete(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseEnrollmentService.remove(id);
  }
}
