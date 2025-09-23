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
import { CourseProgressService } from './course-progress.service';
import { CreateCourseProgressDto } from './dto/create-course-progress.dto';
import { UpdateCourseProgressDto } from './dto/update-course-progress.dto';
import { QueryCourseProgressDto } from './dto/query-course-progress.dto';

@Controller('course-progress')
export class CourseProgressController {
  constructor(private readonly courseProgressService: CourseProgressService) {}

  @Post()
  create(@Body() createCourseProgressDto: CreateCourseProgressDto) {
    return this.courseProgressService.create(createCourseProgressDto);
  }

  @Get()
  findAll(@Query() query: QueryCourseProgressDto) {
    return this.courseProgressService.findAll(query);
  }

  @Get('stats/:enrollmentId')
  getStats(@Param('enrollmentId', ParseIntPipe) enrollmentId: number) {
    return this.courseProgressService.getProgressStats(enrollmentId);
  }

  @Get('enrollment/:enrollmentId/lesson/:lessonId')
  findByEnrollmentAndLesson(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number
  ) {
    return this.courseProgressService.findByEnrollmentAndLesson(enrollmentId, lessonId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseProgressService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseProgressDto: UpdateCourseProgressDto
  ) {
    return this.courseProgressService.update(id, updateCourseProgressDto);
  }

  @Patch('enrollment/:enrollmentId/lesson/:lessonId/complete')
  markAsCompleted(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number
  ) {
    return this.courseProgressService.markAsCompleted(enrollmentId, lessonId);
  }

  @Patch('enrollment/:enrollmentId/lesson/:lessonId/incomplete')
  markAsIncomplete(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number
  ) {
    return this.courseProgressService.markAsIncomplete(enrollmentId, lessonId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseProgressService.remove(id);
  }
}
