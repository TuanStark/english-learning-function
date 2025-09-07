import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';
import { FindAllGrammarDto } from './dto/find-all-grammar.dto';

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

  async findAll(query: FindAllGrammarDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'orderIndex',
      sortOrder = 'asc',
      difficultyLevel,
      includeInactive = false
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const take = limitNumber;
    const skip = (pageNumber - 1) * take;

    const where: any = {};
    
    // Add search filters
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { content: { contains: search.trim() } },
        { difficultyLevel: { contains: search.trim() } },
      ];
    }
    
    // Add difficultyLevel filter
    if (difficultyLevel) {
      where.difficultyLevel = difficultyLevel;
    }
    
    // Add active filter
    if (!includeInactive) {
      where.isActive = true;
    }

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [grammars, total] = await Promise.all([
      this.prisma.grammar.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          examples: {
            select: {
              id: true,
              englishSentence: true,
              vietnameseSentence: true,
            }
          },
          userProgress: {
            select: {
              id: true,
              userId: true,
              status: true,
              masteryLevel: true,
            },
          },
          _count: {
            select: {
              examples: true,
              userProgress: true,
            }
          }
        }
      }),
      this.prisma.grammar.count({
        where: where,
      })
    ]);

    return {
      data: grammars,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const grammar = await this.prisma.grammar.findUnique({
      where: { id },
      include: {
        examples: true,
        questions: {
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
