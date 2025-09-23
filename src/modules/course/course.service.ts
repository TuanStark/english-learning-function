import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    // Check if slug already exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { slug: createCourseDto.slug }
    });

    if (existingCourse) {
      throw new BadRequestException('Slug already exists');
    }

    return this.prisma.course.create({
      data: createCourseDto,
      include: {
        sections: {
          include: {
            lessons: true
          }
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            sections: true,
            enrollments: true
          }
        }
      }
    });
  }

  async findAll(query: QueryCourseDto) {
    const { page = 1, limit = 10, search, level, language, isPublished, minPrice, maxPrice } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (level) {
      where.level = level;
    }

    if (language) {
      where.language = language;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              sections: true,
              enrollments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.course.count({ where })
    ]);

    return {
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { orderIndex: 'asc' }
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            sections: true,
            enrollments: true
          }
        }
      }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        sections: {
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: {
            sections: true,
            enrollments: true
          }
        }
      }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    // Check if slug already exists (if updating slug)
    if (updateCourseDto.slug && updateCourseDto.slug !== existingCourse.slug) {
      const slugExists = await this.prisma.course.findUnique({
        where: { slug: updateCourseDto.slug }
      });

      if (slugExists) {
        throw new BadRequestException('Slug already exists');
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        sections: {
          include: {
            lessons: true
          }
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            sections: true,
            enrollments: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.delete({
      where: { id }
    });
  }

  async publish(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date()
      }
    });
  }

  async unpublish(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        isPublished: false,
        publishedAt: null
      }
    });
  }
}
