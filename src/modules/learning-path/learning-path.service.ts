import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Injectable()
export class LearningPathService {
  constructor(private prisma: PrismaService) {}

  async create(createLearningPathDto: CreateLearningPathDto) {
    return this.prisma.learningPath.create({
      data: createLearningPathDto,
      include: {
        pathSteps: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        userLearningPaths: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.learningPath.findMany({
      where: { isActive: true },
      include: {
        pathSteps: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        _count: {
          select: {
            userLearningPaths: true,
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const learningPath = await this.prisma.learningPath.findUnique({
      where: { id },
      include: {
        pathSteps: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        userLearningPaths: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!learningPath) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }

    return learningPath;
  }

  async update(id: number, updateLearningPathDto: UpdateLearningPathDto) {
    const existingLearningPath = await this.prisma.learningPath.findUnique({
      where: { id },
    });

    if (!existingLearningPath) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }

    return this.prisma.learningPath.update({
      where: { id },
      data: updateLearningPathDto,
      include: {
        pathSteps: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        userLearningPaths: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingLearningPath = await this.prisma.learningPath.findUnique({
      where: { id },
    });

    if (!existingLearningPath) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }

    return this.prisma.learningPath.delete({
      where: { id },
    });
  }

  async findByTargetLevel(targetLevel: string) {
    return this.prisma.learningPath.findMany({
      where: { 
        targetLevel,
        isActive: true,
      },
      include: {
        pathSteps: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        _count: {
          select: {
            userLearningPaths: true,
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async getLearningPathStats(id: number) {
    const learningPath = await this.prisma.learningPath.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            pathSteps: true,
            userLearningPaths: true,
          },
        },
        userLearningPaths: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!learningPath) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }

    const completedUsers = learningPath.userLearningPaths.filter(
      (ulp) => ulp.status === 'Completed',
    ).length;

    const inProgressUsers = learningPath.userLearningPaths.filter(
      (ulp) => ulp.status === 'InProgress',
    ).length;

    return {
      totalSteps: learningPath._count.pathSteps,
      totalUsers: learningPath._count.userLearningPaths,
      completedUsers,
      inProgressUsers,
      completionRate: learningPath._count.userLearningPaths > 0 
        ? (completedUsers / learningPath._count.userLearningPaths) * 100 
        : 0,
    };
  }
}
