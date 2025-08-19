import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserVocabulariesProgressDto } from './dto/create-user-vocabularies-progress.dto';
import { UpdateUserVocabulariesProgressDto } from './dto/update-user-vocabularies-progress.dto';
import { FindAllDto } from 'src/common/global/find-all.dto';

@Injectable()
export class UserVocabulariesProgressService {
  constructor(private prisma: PrismaService) {}

  async create(createUserVocabulariesProgressDto: CreateUserVocabulariesProgressDto) {
    // Kiểm tra xem user và vocabulary có tồn tại không
    const [user, vocabulary] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: createUserVocabulariesProgressDto.userId },
      }),
      this.prisma.vocabulary.findUnique({
        where: { id: createUserVocabulariesProgressDto.vocabularyId },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createUserVocabulariesProgressDto.userId} not found`
      );
    }

    if (!vocabulary) {
      throw new NotFoundException(
        `Vocabulary with ID ${createUserVocabulariesProgressDto.vocabularyId} not found`
      );
    }

    // Kiểm tra xem đã có progress cho user và vocabulary này chưa
    const existingProgress = await this.prisma.userVocabularyProgress.findUnique({
      where: {
        userId_vocabularyId: {
          userId: createUserVocabulariesProgressDto.userId,
          vocabularyId: createUserVocabulariesProgressDto.vocabularyId,
        },
      },
    });

    if (existingProgress) {
      throw new ConflictException(
        `Progress already exists for user ${createUserVocabulariesProgressDto.userId} and vocabulary ${createUserVocabulariesProgressDto.vocabularyId}`
      );
    }

    return this.prisma.userVocabularyProgress.create({
      data: createUserVocabulariesProgressDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        vocabulary: {
          include: {
            topic: {
              select: {
                id: true,
                topicName: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(query: FindAllDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const take = limitNumber;
    const skip = (pageNumber - 1) * take;

    const searchUpCase = search.charAt(0).toUpperCase() + search.slice(1);
    const where = search
      ? {
        OR: [
          { vocabulary: { englishWord: { contains: searchUpCase } } },
        ]
      }
      : {};
    const orderBy = {
      [sortBy]: sortOrder
    };

    const [progresses, total] = await Promise.all([
      this.prisma.userVocabularyProgress.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          vocabulary: {
            select: {
              id: true,
              englishWord: true,
              vietnameseMeaning: true,
              difficultyLevel: true,
            },
          },
        }
      }),
      this.prisma.userVocabularyProgress.count({
        where: where,
      })
    ])

    return {
      data: progresses,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const progress = await this.prisma.userVocabularyProgress.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        vocabulary: {
          include: {
            topic: {
              select: {
                id: true,
                topicName: true,
              },
            },
          },
        },
      },
    });

    if (!progress) {
      throw new NotFoundException(`User vocabulary progress with ID ${id} not found`);
    }

    return progress;
  }

  async update(id: number, updateUserVocabulariesProgressDto: UpdateUserVocabulariesProgressDto) {
    const existingProgress = await this.prisma.userVocabularyProgress.findUnique({
      where: { id },
    });

    if (!existingProgress) {
      throw new NotFoundException(`User vocabulary progress with ID ${id} not found`);
    }

    // Nếu có userId hoặc vocabularyId mới, kiểm tra xem chúng có tồn tại không
    if (updateUserVocabulariesProgressDto.userId || updateUserVocabulariesProgressDto.vocabularyId) {
      if (updateUserVocabulariesProgressDto.userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: updateUserVocabulariesProgressDto.userId },
        });

        if (!user) {
          throw new NotFoundException(
            `User with ID ${updateUserVocabulariesProgressDto.userId} not found`
          );
        }
      }

      if (updateUserVocabulariesProgressDto.vocabularyId) {
        const vocabulary = await this.prisma.vocabulary.findUnique({
          where: { id: updateUserVocabulariesProgressDto.vocabularyId },
        });

        if (!vocabulary) {
          throw new NotFoundException(
            `Vocabulary with ID ${updateUserVocabulariesProgressDto.vocabularyId} not found`
          );
        }
      }
    }

    // Cập nhật lastPracticedAt nếu timesPracticed tăng
    const updateData: any = { ...updateUserVocabulariesProgressDto };
    if (updateData.timesPracticed && updateData.timesPracticed > existingProgress.timesPracticed) {
      updateData.lastPracticedAt = new Date();
    }

    return this.prisma.userVocabularyProgress.update({
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
        vocabulary: {
          include: {
            topic: {
              select: {
                id: true,
                topicName: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingProgress = await this.prisma.userVocabularyProgress.findUnique({
      where: { id },
    });

    if (!existingProgress) {
      throw new NotFoundException(`User vocabulary progress with ID ${id} not found`);
    }

    return this.prisma.userVocabularyProgress.delete({
      where: { id },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.userVocabularyProgress.findMany({
      where: { userId },
      include: {
        vocabulary: {
          include: {
            topic: {
              select: {
                id: true,
                topicName: true,
              },
            },
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
      this.prisma.userVocabularyProgress.count({
        where: { userId },
      }),
      this.prisma.userVocabularyProgress.count({
        where: { userId, status: 'Learning' },
      }),
      this.prisma.userVocabularyProgress.count({
        where: { userId, status: 'Mastered' },
      }),
      this.prisma.userVocabularyProgress.count({
        where: { userId, status: 'NeedsReview' },
      }),
    ]);

    const avgMasteryLevel = await this.prisma.userVocabularyProgress.aggregate({
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

  async updateProgress(userId: number, vocabularyId: number, practiceResult: boolean) {
    const progress = await this.prisma.userVocabularyProgress.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId,
        },
      },
    });

    if (!progress) {
      // Tạo mới nếu chưa có
      return this.create({
        userId,
        vocabularyId,
        timesPracticed: 1,
        masteryLevel: practiceResult ? 20 : 10,
        status: 'Learning',
      });
    }

    // Cập nhật dựa trên kết quả luyện tập
    let newMasteryLevel = progress.masteryLevel;
    let newStatus = progress.status;

    if (practiceResult) {
      newMasteryLevel = Math.min(100, progress.masteryLevel + 10);
      if (newMasteryLevel >= 80) {
        newStatus = 'Mastered';
      }
    } else {
      newMasteryLevel = Math.max(0, progress.masteryLevel - 5);
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
