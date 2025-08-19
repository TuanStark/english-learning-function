import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExamAttemptDto } from './dto/create-exam-attempt.dto';
import { UpdateExamAttemptDto } from './dto/update-exam-attempt.dto';

@Injectable()
export class ExamAttemptService {
  constructor(private prisma: PrismaService) {}

  async create(createExamAttemptDto: CreateExamAttemptDto) {
    // Kiểm tra xem user và exam có tồn tại không
    const [user, exam] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: createExamAttemptDto.userId },
      }),
      this.prisma.exam.findUnique({
        where: { id: createExamAttemptDto.examId },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(`User with ID ${createExamAttemptDto.userId} not found`);
    }

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${createExamAttemptDto.examId} not found`);
    }

    // Kiểm tra xem user có đang làm bài này không (InProgress)
    const existingAttempt = await this.prisma.examAttempt.findFirst({
      where: {
        userId: createExamAttemptDto.userId,
        examId: createExamAttemptDto.examId,
        status: 'InProgress',
      },
    });

    if (existingAttempt) {
      throw new ConflictException(
        `User ${createExamAttemptDto.userId} already has an in-progress attempt for exam ${createExamAttemptDto.examId}`
      );
    }

    return this.prisma.examAttempt.create({
      data: createExamAttemptDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        exam: {
          select: {
            id: true,
            title: true,
            duration: true,
            difficulty: true,
          },
        },
      },
    });
  }

  async findAll(userId?: number, examId?: number, status?: string) {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (examId) {
      where.examId = examId;
    }
    
    if (status) {
      where.status = status;
    }

    return this.prisma.examAttempt.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        exam: {
          select: {
            id: true,
            title: true,
            duration: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        exam: {
          include: {
            questions: {
              include: {
                answerOptions: true,
              },
              orderBy: {
                orderIndex: 'asc',
              },
            },
          },
        },
        aiExplanations: {
          include: {
            question: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Exam attempt with ID ${id} not found`);
    }

    return attempt;
  }

  async update(id: number, updateExamAttemptDto: UpdateExamAttemptDto) {
    const existingAttempt = await this.prisma.examAttempt.findUnique({
      where: { id },
    });

    if (!existingAttempt) {
      throw new NotFoundException(`Exam attempt with ID ${id} not found`);
    }

    // Tự động set completedAt nếu status chuyển thành Completed
    const updateData: any = { ...updateExamAttemptDto };
    if (updateData.status === 'Completed' && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    return this.prisma.examAttempt.update({
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
        exam: {
          select: {
            id: true,
            title: true,
            duration: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingAttempt = await this.prisma.examAttempt.findUnique({
      where: { id },
    });

    if (!existingAttempt) {
      throw new NotFoundException(`Exam attempt with ID ${id} not found`);
    }

    return this.prisma.examAttempt.delete({
      where: { id },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.examAttempt.findMany({
      where: { userId },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findByExam(examId: number) {
    return this.prisma.examAttempt.findMany({
      where: { examId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async getUserExamStats(userId: number) {
    const [total, completed, inProgress, cancelled] = await Promise.all([
      this.prisma.examAttempt.count({
        where: { userId },
      }),
      this.prisma.examAttempt.count({
        where: { userId, status: 'Completed' },
      }),
      this.prisma.examAttempt.count({
        where: { userId, status: 'InProgress' },
      }),
      this.prisma.examAttempt.count({
        where: { userId, status: 'Cancelled' },
      }),
    ]);

    const avgScore = await this.prisma.examAttempt.aggregate({
      where: { userId, status: 'Completed' },
      _avg: {
        score: true,
      },
    });

    return {
      total,
      completed,
      inProgress,
      cancelled,
      averageScore: avgScore._avg.score || 0,
    };
  }

  async submitExam(id: number, answers: any[]) {
    const attempt = await this.findOne(id);
    
    if (attempt.status !== 'InProgress') {
      throw new ConflictException('Exam attempt is not in progress');
    }

    // Tính điểm
    let correctAnswers = 0;
    const detailedResult: any[] = [];

    for (const answer of answers) {
      const question = attempt.exam.questions.find(q => q.id === answer.questionId);
      if (question) {
        const correctOption = question.answerOptions.find(opt => opt.isCorrect);
        const isCorrect = correctOption && correctOption.optionLabel === answer.selectedOption;

        if (isCorrect) {
          correctAnswers++;
        }

        detailedResult.push({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          correctOption: correctOption?.optionLabel,
          isCorrect,
          points: isCorrect ? question.points : 0,
        });
      }
    }

    const totalPoints = attempt.exam.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = detailedResult.reduce((sum, result) => sum + result.points, 0);
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    return this.update(id, {
      status: 'Completed',
      score,
      correctAnswers,
      detailedResult,
      completedAt: new Date(),
    });
  }
}
