import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';

@Injectable()
export class CourseSectionService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseSectionDto: CreateCourseSectionDto) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createCourseSectionDto.courseId }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.courseSection.create({
      data: createCourseSectionDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        lessons: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async findAll(courseId?: number) {
    const where = courseId ? { courseId } : {};

    return this.prisma.courseSection.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        lessons: {
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: {
            lessons: true
          }
        }
      },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async findOne(id: number) {
    const section = await this.prisma.courseSection.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        lessons: {
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: {
            lessons: true
          }
        }
      }
    });

    if (!section) {
      throw new NotFoundException('Course section not found');
    }

    return section;
  }

  async update(id: number, updateCourseSectionDto: UpdateCourseSectionDto) {
    const existingSection = await this.prisma.courseSection.findUnique({
      where: { id }
    });

    if (!existingSection) {
      throw new NotFoundException('Course section not found');
    }

    // Check if course exists (if updating courseId)
    if (updateCourseSectionDto.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: updateCourseSectionDto.courseId }
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    return this.prisma.courseSection.update({
      where: { id },
      data: updateCourseSectionDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        lessons: {
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: {
            lessons: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const existingSection = await this.prisma.courseSection.findUnique({
      where: { id }
    });

    if (!existingSection) {
      throw new NotFoundException('Course section not found');
    }

    return this.prisma.courseSection.delete({
      where: { id }
    });
  }

  async reorder(sectionId: number, newOrderIndex: number) {
    const section = await this.prisma.courseSection.findUnique({
      where: { id: sectionId }
    });

    if (!section) {
      throw new NotFoundException('Course section not found');
    }

    // Get all sections in the same course
    const allSections = await this.prisma.courseSection.findMany({
      where: { courseId: section.courseId },
      orderBy: { orderIndex: 'asc' }
    });

    // Update order indices
    const sectionsToUpdate: { id: number; orderIndex: number }[] = [];
    
    for (let i = 0; i < allSections.length; i++) {
      const currentSection = allSections[i];
      let newIndex = i;

      if (currentSection.id === sectionId) {
        newIndex = newOrderIndex;
      } else if (i >= newOrderIndex && currentSection.orderIndex < section.orderIndex) {
        newIndex = i + 1;
      } else if (i <= newOrderIndex && currentSection.orderIndex > section.orderIndex) {
        newIndex = i - 1;
      }

      if (newIndex !== currentSection.orderIndex) {
        sectionsToUpdate.push({
          id: currentSection.id,
          orderIndex: newIndex
        });
      }
    }

    // Update all sections
    await Promise.all(
      sectionsToUpdate.map(update => 
        this.prisma.courseSection.update({
          where: { id: update.id },
          data: { orderIndex: update.orderIndex }
        })
      )
    );

    return this.findOne(sectionId);
  }
}
