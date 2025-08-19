import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    // Kiểm tra xem exam có tồn tại không
    const exam = await this.prisma.exam.findUnique({
      where: { id: createQuestionDto.examId },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${createQuestionDto.examId} not found`);
    }

    return this.prisma.question.create({
      data: createQuestionDto,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
        answerOptions: true,
      },
    });
  }

  async findAll(examId?: number, questionType?: string) {
    const where: any = {};
    
    if (examId) {
      where.examId = examId;
    }
    
    if (questionType) {
      where.questionType = questionType;
    }

    return this.prisma.question.findMany({
      where,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
        answerOptions: true,
      },
      orderBy: [
        { examId: 'asc' },
        { orderIndex: 'asc' },
      ],
    });
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            duration: true,
          },
        },
        answerOptions: {
          orderBy: {
            optionLabel: 'asc',
          },
        },
        aiExplanations: true,
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const existingQuestion = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Nếu có examId mới, kiểm tra xem exam có tồn tại không
    if (updateQuestionDto.examId) {
      const exam = await this.prisma.exam.findUnique({
        where: { id: updateQuestionDto.examId },
      });

      if (!exam) {
        throw new NotFoundException(`Exam with ID ${updateQuestionDto.examId} not found`);
      }
    }

    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
        answerOptions: true,
      },
    });
  }

  async remove(id: number) {
    const existingQuestion = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return this.prisma.question.delete({
      where: { id },
    });
  }

  async findByExam(examId: number) {
    return this.prisma.question.findMany({
      where: { examId },
      include: {
        answerOptions: {
          orderBy: {
            optionLabel: 'asc',
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async getQuestionStats(id: number) {
    const question = await this.findOne(id);
    
    const totalOptions = question.answerOptions.length;
    const correctOptions = question.answerOptions.filter(option => option.isCorrect).length;

    return {
      ...question,
      stats: {
        totalOptions,
        correctOptions,
        hasMultipleCorrectAnswers: correctOptions > 1,
      },
    };
  }
}
