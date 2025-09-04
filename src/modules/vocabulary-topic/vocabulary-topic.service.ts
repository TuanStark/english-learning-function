import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVocabularyTopicDto } from './dto/create-vocabulary-topic.dto';
import { UpdateVocabularyTopicDto } from './dto/update-vocabulary-topic.dto';
import { FindAllDto } from 'src/common/global/find-all.dto';

@Injectable()
export class VocabularyTopicService {
  constructor(private prisma: PrismaService) {}

  async create(createVocabularyTopicDto: CreateVocabularyTopicDto) {
    try {
      return await this.prisma.vocabularyTopic.create({
        data: {
          topicName: createVocabularyTopicDto.topicName,
          description: createVocabularyTopicDto.description,
          image: createVocabularyTopicDto.image,
          orderIndex: createVocabularyTopicDto.orderIndex,
          isActive: createVocabularyTopicDto.isActive,
        },
        include: {
          vocabularies: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Không thể tạo VocabularyTopic: id đã tồn tại`);
      }
      throw error;
    }
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
          { topicName: { contains: searchUpCase } },
        ]
      }
      : {};
    const orderBy = {
      [sortBy]: sortOrder
    };

    const [topics, total] = await Promise.all([
      this.prisma.vocabularyTopic.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          vocabularies: {
            where: { isActive: true },
            select: {
              id: true,
              englishWord: true,
              vietnameseMeaning: true,
              difficultyLevel: true,
            },
          },
        }
      }),
      this.prisma.vocabularyTopic.count({
        where: where,
      })
    ])

    return {
      data: topics,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const topic = await this.prisma.vocabularyTopic.findUnique({
      where: { id },
      include: {
        vocabularies: {
          where: { isActive: true },
          include: {
            userProgress: true,
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException(`Vocabulary topic with ID ${id} not found`);
    }

    return topic;
  }

  async update(id: number, updateVocabularyTopicDto: UpdateVocabularyTopicDto) {
    const existingTopic = await this.prisma.vocabularyTopic.findUnique({
      where: { id },
    });

    if (!existingTopic) {
      throw new NotFoundException(`Vocabulary topic with ID ${id} not found`);
    }

    return this.prisma.vocabularyTopic.update({
      where: { id },
      data: updateVocabularyTopicDto,
      include: {
        vocabularies: true,
      },
    });
  }

  async remove(id: number) {
    const existingTopic = await this.prisma.vocabularyTopic.findUnique({
      where: { id },
    });

    if (!existingTopic) {
      throw new NotFoundException(`Vocabulary topic with ID ${id} not found`);
    }

    return this.prisma.vocabularyTopic.delete({
      where: { id },
    });
  }

  async getTopicStats(id: number) {
    const topic = await this.findOne(id);
    
    const totalVocabularies = topic.vocabularies.length;
    const totalUserProgress = topic.vocabularies.reduce(
      (sum, vocab) => sum + vocab.userProgress.length,
      0
    );

    return {
      ...topic,
      stats: {
        totalVocabularies,
        totalUserProgress,
      },
    };
  }

  async addBulkVocabularies(topicId: number, vocabularies: any[]) {
    // Verify topic exists
    const topic = await this.prisma.vocabularyTopic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new NotFoundException(`Vocabulary topic with ID ${topicId} not found`);
    }

    // Prepare vocabulary data
    const vocabularyData = vocabularies.map((vocab, index) => ({
      topicId: topicId,
      englishWord: vocab.englishWord,
      pronunciation: vocab.pronunciation || null,
      vietnameseMeaning: vocab.vietnameseMeaning,
      wordType: vocab.wordType || null,
      difficultyLevel: vocab.difficultyLevel || 'Easy',
      image: vocab.image || null,
      audioFile: vocab.audioFile || null,
      isActive: true,
    }));

    // Create vocabularies in bulk
    const result = await this.prisma.vocabulary.createMany({
      data: vocabularyData,
      skipDuplicates: true, // Skip if duplicate englishWord exists
    });

    // Return the created vocabularies
    const createdVocabularies = await this.prisma.vocabulary.findMany({
      where: {
        topicId: topicId,
        englishWord: {
          in: vocabularies.map(v => v.englishWord)
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: result.count
    });

    return {
      success: true,
      created: result.count,
      vocabularies: createdVocabularies,
      skipped: vocabularies.length - result.count
    };
  }
}
