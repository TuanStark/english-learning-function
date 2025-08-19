import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';

@Injectable()
export class GrammarService {
  constructor(private prisma: PrismaService) {}

  async create(createGrammarDto: CreateGrammarDto) {
    return this.prisma.grammar.create({
      data: createGrammarDto,
      include: {
        examples: true,
      },
    });
  }

  async findAll(difficultyLevel?: string, includeInactive = false) {
    const where: any = {};
    
    if (!includeInactive) {
      where.isActive = true;
    }
    
    if (difficultyLevel) {
      where.difficultyLevel = difficultyLevel;
    }

    return this.prisma.grammar.findMany({
      where,
      include: {
        examples: true,
        userProgress: {
          select: {
            id: true,
            userId: true,
            status: true,
            masteryLevel: true,
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const grammar = await this.prisma.grammar.findUnique({
      where: { id },
      include: {
        examples: true,
        userProgress: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!grammar) {
      throw new NotFoundException(`Grammar with ID ${id} not found`);
    }

    return grammar;
  }

  async update(id: number, updateGrammarDto: UpdateGrammarDto) {
    const existingGrammar = await this.prisma.grammar.findUnique({
      where: { id },
    });

    if (!existingGrammar) {
      throw new NotFoundException(`Grammar with ID ${id} not found`);
    }

    return this.prisma.grammar.update({
      where: { id },
      data: updateGrammarDto,
      include: {
        examples: true,
      },
    });
  }

  async remove(id: number) {
    const existingGrammar = await this.prisma.grammar.findUnique({
      where: { id },
    });

    if (!existingGrammar) {
      throw new NotFoundException(`Grammar with ID ${id} not found`);
    }

    return this.prisma.grammar.delete({
      where: { id },
    });
  }

  async getGrammarStats(id: number) {
    const grammar = await this.findOne(id);
    
    const totalExamples = grammar.examples.length;
    const totalUsers = grammar.userProgress.length;
    const masteredUsers = grammar.userProgress.filter(progress => progress.status === 'Mastered').length;

    return {
      ...grammar,
      stats: {
        totalExamples,
        totalUsers,
        masteredUsers,
        masteryRate: totalUsers > 0 ? Math.round((masteredUsers / totalUsers) * 100) : 0,
      },
    };
  }

  async searchGrammar(searchTerm: string) {
    return this.prisma.grammar.findMany({
      where: {
        isActive: true,
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        examples: true,
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }
}
