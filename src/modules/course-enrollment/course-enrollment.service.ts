import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';
import { UpdateCourseEnrollmentDto } from './dto/update-course-enrollment.dto';
import { QueryCourseEnrollmentDto } from './dto/query-course-enrollment.dto';

@Injectable()
export class CourseEnrollmentService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseEnrollmentDto: CreateCourseEnrollmentDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createCourseEnrollmentDto.userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createCourseEnrollmentDto.courseId }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is already enrolled
    const existingEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: createCourseEnrollmentDto.userId,
          courseId: createCourseEnrollmentDto.courseId
        }
      }
    });

    if (existingEnrollment) {
      throw new BadRequestException('User is already enrolled in this course');
    }

    return this.prisma.courseEnrollment.create({
      data: createCourseEnrollmentDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        },
        progress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                contentType: true,
                duration: true
              }
            }
          }
        },
        _count: {
          select: {
            progress: true
          }
        }
      }
    });
  }

  async findAll(query: QueryCourseEnrollmentDto) {
    const { page = 1, limit = 10, userId, courseId, status, isCompleted } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (status) {
      where.status = status;
    }

    if (isCompleted !== undefined) {
      if (isCompleted) {
        where.completedAt = { not: null };
      } else {
        where.completedAt = null;
      }
    }

    const [enrollments, total] = await Promise.all([
      this.prisma.courseEnrollment.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatar: true
            }
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true,
              price: true,
              discountPrice: true
            }
          },
          _count: {
            select: {
              progress: true
            }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      }),
      this.prisma.courseEnrollment.count({ where })
    ]);

    return {
      data: enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true,
            sections: {
              include: {
                lessons: {
                  orderBy: { orderIndex: 'asc' }
                }
              },
              orderBy: { orderIndex: 'asc' }
            }
          }
        },
        progress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                contentType: true,
                duration: true,
                isPreview: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    if (!enrollment) {
      throw new NotFoundException('Course enrollment not found');
    }

    return enrollment;
  }

  async findByUserAndCourse(userId: number, courseId: number) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        },
        progress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                contentType: true,
                duration: true,
                isPreview: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    if (!enrollment) {
      throw new NotFoundException('Course enrollment not found');
    }

    return enrollment;
  }

  async update(id: number, updateCourseEnrollmentDto: UpdateCourseEnrollmentDto) {
    const existingEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id }
    });

    if (!existingEnrollment) {
      throw new NotFoundException('Course enrollment not found');
    }

    // Check if user exists (if updating userId)
    if (updateCourseEnrollmentDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateCourseEnrollmentDto.userId }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    // Check if course exists (if updating courseId)
    if (updateCourseEnrollmentDto.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: updateCourseEnrollmentDto.courseId }
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    return this.prisma.courseEnrollment.update({
      where: { id },
      data: updateCourseEnrollmentDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        },
        progress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                contentType: true,
                duration: true
              }
            }
          }
        },
        _count: {
          select: {
            progress: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const existingEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id }
    });

    if (!existingEnrollment) {
      throw new NotFoundException('Course enrollment not found');
    }

    return this.prisma.courseEnrollment.delete({
      where: { id }
    });
  }

  async complete(id: number) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id }
    });

    if (!enrollment) {
      throw new NotFoundException('Course enrollment not found');
    }

    return this.prisma.courseEnrollment.update({
      where: { id },
      data: {
        status: 'Completed',
        completedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        }
      }
    });
  }

  async getEnrollmentStats(courseId?: number) {
    const where = courseId ? { courseId } : {};

    const [total, completed, inProgress] = await Promise.all([
      this.prisma.courseEnrollment.count({ where }),
      this.prisma.courseEnrollment.count({
        where: { ...where, status: 'Completed' }
      }),
      this.prisma.courseEnrollment.count({
        where: { ...where, status: 'InProgress' }
      })
    ]);

    return {
      total,
      completed,
      inProgress,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }
}
