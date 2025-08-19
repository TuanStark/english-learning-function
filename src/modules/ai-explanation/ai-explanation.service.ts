import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAIExplanationDto } from './dto/create-ai-explanation.dto';
import { UpdateAIExplanationDto } from './dto/update-ai-explanation.dto';

@Injectable()
export class AIExplanationService {
  constructor(private prisma: PrismaService) {}

  async create(createAIExplanationDto: CreateAIExplanationDto) {
    // Kiểm tra xem examAttempt và question có tồn tại không
    const [examAttempt, question] = await Promise.all([
      this.prisma.examAttempt.findUnique({
        where: { id: createAIExplanationDto.examAttemptId },
      }),
      this.prisma.question.findUnique({
        where: { id: createAIExplanationDto.questionId },
      }),
    ]);

    if (!examAttempt) {
      throw new NotFoundException(
        `Exam attempt with ID ${createAIExplanationDto.examAttemptId} not found`
      );
    }

    if (!question) {
      throw new NotFoundException(
        `Question with ID ${createAIExplanationDto.questionId} not found`
      );
    }

    return this.prisma.aIExplanation.create({
      data: createAIExplanationDto,
      include: {
        examAttempt: {
          select: {
            id: true,
            score: true,
            status: true,
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        question: {
          select: {
            id: true,
            content: true,
            questionType: true,
          },
        },
      },
    });
  }

  async findAll(examAttemptId?: number, questionId?: number) {
    const where: any = {};
    
    if (examAttemptId) {
      where.examAttemptId = examAttemptId;
    }
    
    if (questionId) {
      where.questionId = questionId;
    }

    return this.prisma.aIExplanation.findMany({
      where,
      include: {
        examAttempt: {
          select: {
            id: true,
            score: true,
            status: true,
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        question: {
          select: {
            id: true,
            content: true,
            questionType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const explanation = await this.prisma.aIExplanation.findUnique({
      where: { id },
      include: {
        examAttempt: {
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
                difficulty: true,
              },
            },
          },
        },
        question: {
          include: {
            answerOptions: true,
            exam: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!explanation) {
      throw new NotFoundException(`AI explanation with ID ${id} not found`);
    }

    return explanation;
  }

  async update(id: number, updateAIExplanationDto: UpdateAIExplanationDto) {
    const existingExplanation = await this.prisma.aIExplanation.findUnique({
      where: { id },
    });

    if (!existingExplanation) {
      throw new NotFoundException(`AI explanation with ID ${id} not found`);
    }

    return this.prisma.aIExplanation.update({
      where: { id },
      data: updateAIExplanationDto,
      include: {
        examAttempt: {
          select: {
            id: true,
            score: true,
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            content: true,
            questionType: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingExplanation = await this.prisma.aIExplanation.findUnique({
      where: { id },
    });

    if (!existingExplanation) {
      throw new NotFoundException(`AI explanation with ID ${id} not found`);
    }

    return this.prisma.aIExplanation.delete({
      where: { id },
    });
  }

  async findByExamAttempt(examAttemptId: number) {
    return this.prisma.aIExplanation.findMany({
      where: { examAttemptId },
      include: {
        question: {
          select: {
            id: true,
            content: true,
            questionType: true,
            answerOptions: true,
          },
        },
      },
      orderBy: {
        questionId: 'asc',
      },
    });
  }

  async findByQuestion(questionId: number) {
    return this.prisma.aIExplanation.findMany({
      where: { questionId },
      include: {
        examAttempt: {
          select: {
            id: true,
            score: true,
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async generateExplanationForAttempt(examAttemptId: number, questionId: number) {
    // Lấy thông tin chi tiết về câu hỏi và câu trả lời
    const [examAttempt, question] = await Promise.all([
      this.prisma.examAttempt.findUnique({
        where: { id: examAttemptId },
        include: {
          exam: true,
        },
      }),
      this.prisma.question.findUnique({
        where: { id: questionId },
        include: {
          answerOptions: true,
        },
      }),
    ]);

    if (!examAttempt || !question) {
      throw new NotFoundException('Exam attempt or question not found');
    }

    // Tìm đáp án đúng
    const correctOption = question.answerOptions.find(opt => opt.isCorrect);
    
    // Tạo giải thích tự động (có thể tích hợp AI thực tế sau)
    const explanation = `Đáp án đúng cho câu hỏi "${question.content}" là "${correctOption?.optionLabel}: ${correctOption?.content}". ` +
      `Đây là câu hỏi thuộc loại ${question.questionType} với độ khó ${examAttempt.exam.difficulty}.`;

    return this.create({
      examAttemptId,
      questionId,
      explanation,
    });
  }
}
