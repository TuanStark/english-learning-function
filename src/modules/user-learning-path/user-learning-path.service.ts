import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserLearningPathDto } from './dto/create-user-learning-path.dto';
import { UpdateUserLearningPathDto } from './dto/update-user-learning-path.dto';

@Injectable()
export class UserLearningPathService {
  constructor(private prisma: PrismaService) {}

  async create(createUserLearningPathDto: CreateUserLearningPathDto) {
    // Kiểm tra user và learning path có tồn tại không
    const [user, learningPath] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: createUserLearningPathDto.userId },
      }),
      this.prisma.learningPath.findUnique({
        where: { id: createUserLearningPathDto.learningPathId },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(`User with ID ${createUserLearningPathDto.userId} not found`);
    }

    if (!learningPath) {
      throw new NotFoundException(`Learning path with ID ${createUserLearningPathDto.learningPathId} not found`);
    }

    // Kiểm tra xem user đã có learning path này chưa
    const existingUserLearningPath = await this.prisma.userLearningPath.findUnique({
      where: {
        userId_learningPathId: {
          userId: createUserLearningPathDto.userId,
          learningPathId: createUserLearningPathDto.learningPathId,
        },
      },
    });

    if (existingUserLearningPath) {
      throw new ConflictException('User already has this learning path');
    }

    return this.prisma.userLearningPath.create({
      data: createUserLearningPathDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
    });
  }

  async findAll(userId?: number, learningPathId?: number) {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (learningPathId) {
      where.learningPathId = learningPathId;
    }

    return this.prisma.userLearningPath.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const userLearningPath = await this.prisma.userLearningPath.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
    });

    if (!userLearningPath) {
      throw new NotFoundException(`User learning path with ID ${id} not found`);
    }

    return userLearningPath;
  }

  async update(id: number, updateUserLearningPathDto: UpdateUserLearningPathDto) {
    const existingUserLearningPath = await this.prisma.userLearningPath.findUnique({
      where: { id },
    });

    if (!existingUserLearningPath) {
      throw new NotFoundException(`User learning path with ID ${id} not found`);
    }

    // Nếu có thay đổi userId hoặc learningPathId, kiểm tra tính hợp lệ
    if (updateUserLearningPathDto.userId && updateUserLearningPathDto.userId !== existingUserLearningPath.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateUserLearningPathDto.userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${updateUserLearningPathDto.userId} not found`);
      }
    }

    if (updateUserLearningPathDto.learningPathId && updateUserLearningPathDto.learningPathId !== existingUserLearningPath.learningPathId) {
      const learningPath = await this.prisma.learningPath.findUnique({
        where: { id: updateUserLearningPathDto.learningPathId },
      });

      if (!learningPath) {
        throw new NotFoundException(`Learning path with ID ${updateUserLearningPathDto.learningPathId} not found`);
      }
    }

    // Nếu status là Completed, tự động set completedAt
    if (updateUserLearningPathDto.status === 'Completed' && !existingUserLearningPath.completedAt) {
      updateUserLearningPathDto.completedAt = new Date();
    }

    return this.prisma.userLearningPath.update({
      where: { id },
      data: updateUserLearningPathDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingUserLearningPath = await this.prisma.userLearningPath.findUnique({
      where: { id },
    });

    if (!existingUserLearningPath) {
      throw new NotFoundException(`User learning path with ID ${id} not found`);
    }

    return this.prisma.userLearningPath.delete({
      where: { id },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.userLearningPath.findMany({
      where: { userId },
      include: {
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
            estimatedWeeks: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findByLearningPath(learningPathId: number) {
    return this.prisma.userLearningPath.findMany({
      where: { learningPathId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async updateProgress(id: number, progress: any) {
    const existingUserLearningPath = await this.prisma.userLearningPath.findUnique({
      where: { id },
    });

    if (!existingUserLearningPath) {
      throw new NotFoundException(`User learning path with ID ${id} not found`);
    }

    return this.prisma.userLearningPath.update({
      where: { id },
      data: { progress },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
    });
  }

  async completeLearningPath(id: number) {
    const existingUserLearningPath = await this.prisma.userLearningPath.findUnique({
      where: { id },
    });

    if (!existingUserLearningPath) {
      throw new NotFoundException(`User learning path with ID ${id} not found`);
    }

    if (existingUserLearningPath.status === 'Completed') {
      throw new ConflictException('Learning path is already completed');
    }

    return this.prisma.userLearningPath.update({
      where: { id },
      data: {
        status: 'Completed',
        completedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
    });
  }
}
