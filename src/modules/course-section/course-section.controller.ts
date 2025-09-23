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
import { CourseSectionService } from './course-section.service';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';

@Controller('course-sections')
export class CourseSectionController {
  constructor(private readonly courseSectionService: CourseSectionService) {}

  @Post()
  create(@Body() createCourseSectionDto: CreateCourseSectionDto) {
    return this.courseSectionService.create(createCourseSectionDto);
  }

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    const courseIdNumber = courseId ? parseInt(courseId, 10) : undefined;
    return this.courseSectionService.findAll(courseIdNumber);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseSectionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseSectionDto: UpdateCourseSectionDto
  ) {
    return this.courseSectionService.update(id, updateCourseSectionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseSectionService.remove(id);
  }

  @Patch(':id/reorder')
  reorder(
    @Param('id', ParseIntPipe) id: number,
    @Body('orderIndex', ParseIntPipe) orderIndex: number
  ) {
    return this.courseSectionService.reorder(id, orderIndex);
  }
}
