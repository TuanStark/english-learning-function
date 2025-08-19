import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserGrammarProgressDto } from './dto/create-user-grammar-progress.dto';
import { UpdateUserGrammarProgressDto } from './dto/update-user-grammar-progress.dto';

@Injectable()
export class UserGrammarProgressService {
  constructor(private prisma: PrismaService) {}

  async create(createUserGrammarProgressDto: CreateUserGrammarProgressDto) {
    // Kiểm tra xem user và grammar có tồn tại không
    const [user, grammar] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: createUserGrammarProgressDto.userId },
      }),
      this.prisma.grammar.findUnique({
        where: { id: createUserGrammarProgressDto.grammarId },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createUserGrammarProgressDto.userId} not found`
      );
    }

    if (!grammar) {
      throw new NotFoundException(
        `Grammar with ID ${createUserGrammarProgressDto.grammarId} not found`
      );
    }

    // Kiểm tra xem đã có progress cho user và grammar này chưa
    const existingProgress = await this.prisma.userGrammarProgress.findUnique({
      where: {
        userId_grammarId: {
          userId: createUserGrammarProgressDto.userId,
          grammarId: createUserGrammarProgressDto.grammarId,
        },
      },
    });

    if (existingProgress) {
      throw new ConflictException(
        `Progress already exists for user ${createUserGrammarProgressDto.userId} and grammar ${createUserGrammarProgressDto.grammarId}`
      );
    }

    return this.prisma.userGrammarProgress.create({
      data: createUserGrammarProgressDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        grammar: {
          select: {
            id: true,
            title: true,
            difficultyLevel: true,
          },
        },
      },
    });
  }

  async findAll(userId?: number, grammarId?: number, status?: string) {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (grammarId) {
      where.grammarId = grammarId;
    }
    
    if (status) {
      where.status = status;
    }

    return this.prisma.userGrammarProgress.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        grammar: {
          select: {
            id: true,
            title: true,
            difficultyLevel: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const progress = await this.prisma.userGrammarProgress.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        grammar: {
          include: {
            examples: true,
          },
        },
      },
    });

    if (!progress) {
      throw new NotFoundException(`User grammar progress with ID ${id} not found`);
    }

    return progress;
  }

  async update(id: number, updateUserGrammarProgressDto: UpdateUserGrammarProgressDto) {
    const existingProgress = await this.prisma.userGrammarProgress.findUnique({
      where: { id },
    });

    if (!existingProgress) {
      throw new NotFoundException(`User grammar progress with ID ${id} not found`);
    }

    // Cập nhật lastPracticedAt nếu timesPracticed tăng
    const updateData: any = { ...updateUserGrammarProgressDto };
    if (updateData.timesPracticed && updateData.timesPracticed > existingProgress.timesPracticed) {
      updateData.lastPracticedAt = new Date();
    }

    return this.prisma.userGrammarProgress.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        grammar: {
          select: {
            id: true,
            title: true,
            difficultyLevel: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingProgress = await this.prisma.userGrammarProgress.findUnique({
      where: { id },
    });

    if (!existingProgress) {
      throw new NotFoundException(`User grammar progress with ID ${id} not found`);
    }

    return this.prisma.userGrammarProgress.delete({
      where: { id },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.userGrammarProgress.findMany({
      where: { userId },
      include: {
        grammar: {
          select: {
            id: true,
            title: true,
            difficultyLevel: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getUserStats(userId: number) {
    const [total, learning, mastered, needsReview] = await Promise.all([
      this.prisma.userGrammarProgress.count({
        where: { userId },
      }),
      this.prisma.userGrammarProgress.count({
        where: { userId, status: 'Learning' },
      }),
      this.prisma.userGrammarProgress.count({
        where: { userId, status: 'Mastered' },
      }),
      this.prisma.userGrammarProgress.count({
        where: { userId, status: 'NeedsReview' },
      }),
    ]);

    const avgMasteryLevel = await this.prisma.userGrammarProgress.aggregate({
      where: { userId },
      _avg: {
        masteryLevel: true,
      },
    });

    return {
      total,
      learning,
      mastered,
      needsReview,
      averageMasteryLevel: avgMasteryLevel._avg.masteryLevel || 0,
    };
  }

  async updateProgress(userId: number, grammarId: number, practiceResult: boolean) {
    const progress = await this.prisma.userGrammarProgress.findUnique({
      where: {
        userId_grammarId: {
          userId,
          grammarId,
        },
      },
    });

    if (!progress) {
      // Tạo mới nếu chưa có
      return this.create({
        userId,
        grammarId,
        timesPracticed: 1,
        masteryLevel: practiceResult ? 20 : 10,
        status: 'Learning',
      });
    }

    // Cập nhật dựa trên kết quả luyện tập
    let newMasteryLevel = progress.masteryLevel;
    let newStatus = progress.status;

    if (practiceResult) {
      newMasteryLevel = Math.min(100, progress.masteryLevel + 15);
      if (newMasteryLevel >= 80) {
        newStatus = 'Mastered';
      }
    } else {
      newMasteryLevel = Math.max(0, progress.masteryLevel - 10);
      if (newMasteryLevel < 50 && progress.status === 'Mastered') {
        newStatus = 'NeedsReview';
      }
    }

    return this.update(progress.id, {
      timesPracticed: progress.timesPracticed + 1,
      masteryLevel: newMasteryLevel,
      status: newStatus,
    });
  }
}
