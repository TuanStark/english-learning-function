import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseLessonDto } from './dto/create-course-lesson.dto';
import { UpdateCourseLessonDto } from './dto/update-course-lesson.dto';

@Injectable()
export class CourseLessonService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseLessonDto: CreateCourseLessonDto) {
    // Check if section exists
    const section = await this.prisma.courseSection.findUnique({
      where: { id: createCourseLessonDto.sectionId },
      include: { course: true }
    });

    if (!section) {
      throw new NotFoundException('Course section not found');
    }

    return this.prisma.courseLesson.create({
      data: createCourseLessonDto,
      include: {
        section: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        },
        progresses: {
          include: {
            enrollment: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async findAll(sectionId?: number) {
    const where = sectionId ? { sectionId } : {};

    return this.prisma.courseLesson.findMany({
      where,
      include: {
        section: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        },
        _count: {
          select: {
            progresses: true
          }
        }
      },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.courseLesson.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        },
        progresses: {
          include: {
            enrollment: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            progresses: true
          }
        }
      }
    });

    if (!lesson) {
      throw new NotFoundException('Course lesson not found');
    }

    return lesson;
  }

  async update(id: number, updateCourseLessonDto: UpdateCourseLessonDto) {
    const existingLesson = await this.prisma.courseLesson.findUnique({
      where: { id }
    });

    if (!existingLesson) {
      throw new NotFoundException('Course lesson not found');
    }

    // Check if section exists (if updating sectionId)
    if (updateCourseLessonDto.sectionId) {
      const section = await this.prisma.courseSection.findUnique({
        where: { id: updateCourseLessonDto.sectionId }
      });

      if (!section) {
        throw new NotFoundException('Course section not found');
      }
    }

    return this.prisma.courseLesson.update({
      where: { id },
      data: updateCourseLessonDto,
      include: {
        section: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        },
        progresses: {
          include: {
            enrollment: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            progresses: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const existingLesson = await this.prisma.courseLesson.findUnique({
      where: { id }
    });

    if (!existingLesson) {
      throw new NotFoundException('Course lesson not found');
    }

    return this.prisma.courseLesson.delete({
      where: { id }
    });
  }

  async reorder(lessonId: number, newOrderIndex: number) {
    const lesson = await this.prisma.courseLesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      throw new NotFoundException('Course lesson not found');
    }

    // Get all lessons in the same section
    const allLessons = await this.prisma.courseLesson.findMany({
      where: { sectionId: lesson.sectionId },
      orderBy: { orderIndex: 'asc' }
    });

    // Update order indices
    const lessonsToUpdate: { id: number; orderIndex: number }[] = [];
    
    for (let i = 0; i < allLessons.length; i++) {
      const currentLesson = allLessons[i];
      let newIndex = i;

      if (currentLesson.id === lessonId) {
        newIndex = newOrderIndex;
      } else if (i >= newOrderIndex && currentLesson.orderIndex < lesson.orderIndex) {
        newIndex = i + 1;
      } else if (i <= newOrderIndex && currentLesson.orderIndex > lesson.orderIndex) {
        newIndex = i - 1;
      }

      if (newIndex !== currentLesson.orderIndex) {
        lessonsToUpdate.push({
          id: currentLesson.id,
          orderIndex: newIndex
        });
      }
    }

    // Update all lessons
    await Promise.all(
      lessonsToUpdate.map(update => 
        this.prisma.courseLesson.update({
          where: { id: update.id },
          data: { orderIndex: update.orderIndex }
        })
      )
    );

    return this.findOne(lessonId);
  }

  async togglePreview(id: number) {
    const lesson = await this.prisma.courseLesson.findUnique({
      where: { id }
    });

    if (!lesson) {
      throw new NotFoundException('Course lesson not found');
    }

    return this.prisma.courseLesson.update({
      where: { id },
      data: { isPreview: !lesson.isPreview },
      include: {
        section: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        }
      }
    });
  }
}
