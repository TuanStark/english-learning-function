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
import { CourseLessonService } from './course-lesson.service';
import { CreateCourseLessonDto } from './dto/create-course-lesson.dto';
import { UpdateCourseLessonDto } from './dto/update-course-lesson.dto';

@Controller('course-lessons')
export class CourseLessonController {
  constructor(private readonly courseLessonService: CourseLessonService) {}

  @Post()
  create(@Body() createCourseLessonDto: CreateCourseLessonDto) {
    return this.courseLessonService.create(createCourseLessonDto);
  }

  @Get()
  findAll(@Query('sectionId') sectionId?: string) {
    const sectionIdNumber = sectionId ? parseInt(sectionId, 10) : undefined;
    return this.courseLessonService.findAll(sectionIdNumber);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseLessonService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseLessonDto: UpdateCourseLessonDto
  ) {
    return this.courseLessonService.update(id, updateCourseLessonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseLessonService.remove(id);
  }

  @Patch(':id/reorder')
  reorder(
    @Param('id', ParseIntPipe) id: number,
    @Body('orderIndex', ParseIntPipe) orderIndex: number
  ) {
    return this.courseLessonService.reorder(id, orderIndex);
  }

  @Patch(':id/toggle-preview')
  togglePreview(@Param('id', ParseIntPipe) id: number) {
    return this.courseLessonService.togglePreview(id);
  }
}
