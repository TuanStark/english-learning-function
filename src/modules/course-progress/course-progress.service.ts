import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseProgressDto } from './dto/create-course-progress.dto';
import { UpdateCourseProgressDto } from './dto/update-course-progress.dto';
import { QueryCourseProgressDto } from './dto/query-course-progress.dto';

@Injectable()
export class CourseProgressService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseProgressDto: CreateCourseProgressDto) {
    // Check if enrollment exists
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id: createCourseProgressDto.enrollmentId }
    });

    if (!enrollment) {
      throw new NotFoundException('Course enrollment not found');
    }

    // Check if lesson exists
    const lesson = await this.prisma.courseLesson.findUnique({
      where: { id: createCourseProgressDto.lessonId }
    });

    if (!lesson) {
      throw new NotFoundException('Course lesson not found');
    }

    // Check if progress already exists
    const existingProgress = await this.prisma.courseProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: createCourseProgressDto.enrollmentId,
          lessonId: createCourseProgressDto.lessonId
        }
      }
    });

    if (existingProgress) {
      throw new BadRequestException('Progress for this lesson already exists');
    }

    return this.prisma.courseProgress.create({
      data: createCourseProgressDto,
      include: {
        enrollment: {
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
                slug: true
              }
            }
          }
        },
        lesson: {
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
        }
      }
    });
  }

  async findAll(query: QueryCourseProgressDto) {
    const { page = 1, limit = 10, enrollmentId, lessonId, isCompleted } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (enrollmentId) {
      where.enrollmentId = enrollmentId;
    }

    if (lessonId) {
      where.lessonId = lessonId;
    }

    if (isCompleted !== undefined) {
      where.isCompleted = isCompleted;
    }

    const [progresses, total] = await Promise.all([
      this.prisma.courseProgress.findMany({
        where,
        skip,
        take: limit,
        include: {
          enrollment: {
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
                  slug: true
                }
              }
            }
          },
          lesson: {
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
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.courseProgress.count({ where })
    ]);

    return {
      data: progresses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const progress = await this.prisma.courseProgress.findUnique({
      where: { id },
      include: {
        enrollment: {
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
                slug: true
              }
            }
          }
        },
        lesson: {
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
        }
      }
    });

    if (!progress) {
      throw new NotFoundException('Course progress not found');
    }

    return progress;
  }

  async findByEnrollmentAndLesson(enrollmentId: number, lessonId: number) {
    const progress = await this.prisma.courseProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId
        }
      },
      include: {
        enrollment: {
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
                slug: true
              }
            }
          }
        },
        lesson: {
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
        }
      }
    });

    if (!progress) {
      throw new NotFoundException('Course progress not found');
    }

    return progress;
  }

  async update(id: number, updateCourseProgressDto: UpdateCourseProgressDto) {
    const existingProgress = await this.prisma.courseProgress.findUnique({
      where: { id }
    });

    if (!existingProgress) {
      throw new NotFoundException('Course progress not found');
    }

    // Check if enrollment exists (if updating enrollmentId)
    if (updateCourseProgressDto.enrollmentId) {
      const enrollment = await this.prisma.courseEnrollment.findUnique({
        where: { id: updateCourseProgressDto.enrollmentId }
      });

      if (!enrollment) {
        throw new NotFoundException('Course enrollment not found');
      }
    }

    // Check if lesson exists (if updating lessonId)
    if (updateCourseProgressDto.lessonId) {
      const lesson = await this.prisma.courseLesson.findUnique({
        where: { id: updateCourseProgressDto.lessonId }
      });

      if (!lesson) {
        throw new NotFoundException('Course lesson not found');
      }
    }

    return this.prisma.courseProgress.update({
      where: { id },
      data: updateCourseProgressDto,
      include: {
        enrollment: {
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
                slug: true
              }
            }
          }
        },
        lesson: {
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
        }
      }
    });
  }

  async remove(id: number) {
    const existingProgress = await this.prisma.courseProgress.findUnique({
      where: { id }
    });

    if (!existingProgress) {
      throw new NotFoundException('Course progress not found');
    }

    return this.prisma.courseProgress.delete({
      where: { id }
    });
  }

  async markAsCompleted(enrollmentId: number, lessonId: number) {
    // Check if progress exists
    const existingProgress = await this.prisma.courseProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId
        }
      }
    });

    if (!existingProgress) {
      // Create new progress if it doesn't exist
      return this.create({
        enrollmentId,
        lessonId,
        isCompleted: true,
        completedAt: new Date()
      });
    }

    // Update existing progress
    return this.prisma.courseProgress.update({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId
        }
      },
      data: {
        isCompleted: true,
        completedAt: new Date()
      },
      include: {
        enrollment: {
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
                slug: true
              }
            }
          }
        },
        lesson: {
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
        }
      }
    });
  }

  async markAsIncomplete(enrollmentId: number, lessonId: number) {
    const existingProgress = await this.prisma.courseProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId
        }
      }
    });

    if (!existingProgress) {
      throw new NotFoundException('Course progress not found');
    }

    return this.prisma.courseProgress.update({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId
        }
      },
      data: {
        isCompleted: false,
        completedAt: null
      },
      include: {
        enrollment: {
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
                slug: true
              }
            }
          }
        },
        lesson: {
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
        }
      }
    });
  }

  async getProgressStats(enrollmentId: number) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            sections: {
              include: {
                lessons: true
              }
            }
          }
        }
      }
    });

    if (!enrollment) {
      throw new NotFoundException('Course enrollment not found');
    }

    // Get all lessons in the course
    const allLessons = enrollment.course.sections.flatMap(section => section.lessons);
    const totalLessons = allLessons.length;

    // Get completed lessons
    const completedProgresses = await this.prisma.courseProgress.findMany({
      where: {
        enrollmentId,
        isCompleted: true
      }
    });

    const completedLessons = completedProgresses.length;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return {
      enrollmentId,
      totalLessons,
      completedLessons,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      isCompleted: completedLessons === totalLessons
    };
  }
}
