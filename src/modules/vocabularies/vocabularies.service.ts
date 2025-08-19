import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { FindAllDto } from 'src/common/global/find-all.dto';

@Injectable()
export class VocabulariesService {
  constructor(private prisma: PrismaService) {}

  async create(createVocabularyDto: CreateVocabularyDto) {
    return this.prisma.vocabulary.create({
      data: createVocabularyDto,
      include: {
        topic: true,
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
          { englishWord: { contains: searchUpCase } },
        ]
      }
      : {};
    const orderBy = {
      [sortBy]: sortOrder
    };

    const [vocabularies, total] = await Promise.all([
      this.prisma.vocabulary.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          topic: true,
          userProgress: true,
        }
      }),
      this.prisma.vocabulary.count({
        where: where,
      })
    ])

    return {
      data: vocabularies,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
      include: {
        topic: true,
        userProgress: true,
      },
    });

    if (!vocabulary) {
      throw new NotFoundException(`Vocabulary with ID ${id} not found`);
    }

    return vocabulary;
  }

  async update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    const existingVocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
    });

    if (!existingVocabulary) {
      throw new NotFoundException(`Vocabulary with ID ${id} not found`);
    }

    return this.prisma.vocabulary.update({
      where: { id },
      data: updateVocabularyDto,
      include: {
        topic: true,
      },
    });
  }

  async remove(id: number) {
    const existingVocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
    });

    if (!existingVocabulary) {
      throw new NotFoundException(`Vocabulary with ID ${id} not found`);
    }

    return this.prisma.vocabulary.delete({
      where: { id },
    });
  }

  async findByTopic(topicId: number) {
    return this.prisma.vocabulary.findMany({
      where: {
        topicId,
        isActive: true,
      },
      include: {
        userProgress: true,
      },
      orderBy: {
        englishWord: 'asc',
      },
    });
  }

  async searchVocabularies(searchTerm: string) {
    return this.prisma.vocabulary.findMany({
      where: {
        isActive: true,
        OR: [
          {
            englishWord: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            vietnameseMeaning: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        topic: {
          select: {
            id: true,
            topicName: true,
          },
        },
      },
      orderBy: {
        englishWord: 'asc',
      },
    });
  }
}
