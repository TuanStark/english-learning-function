import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverallStats() {
    const [
      totalUsers,
      totalGrammars,
      totalVocabulary,
      totalExams,
      totalBlogPosts
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.grammar.count(),
      this.prisma.vocabulary.count(),
      this.prisma.exam.count(),
      this.prisma.blogPost.count()
    ]);

    return {
      totalUsers,
      totalGrammars,
      totalVocabulary,
      totalExams,
      totalBlogPosts
    };
  }

  async getUserStats(userId: number) {
    const [
      grammarProgress,
      vocabularyProgress,
      examAttempts,
      learningPaths
    ] = await Promise.all([
      this.prisma.userGrammarProgress.findMany({
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
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      this.prisma.userVocabularyProgress.findMany({
        where: { userId },
        include: {
          vocabulary: {
            select: {
              id: true,
              englishWord: true,
              vietnameseMeaning: true,
              difficultyLevel: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      this.prisma.examAttempt.findMany({
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
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.userLearningPath.findMany({
        where: { userId },
        include: {
          learningPath: {
            select: {
              id: true,
              pathName: true,
              targetLevel: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    // Calculate progress percentages
    const totalGrammarProgress = await this.prisma.userGrammarProgress.count({
      where: { userId },
    });

    const masteredGrammar = await this.prisma.userGrammarProgress.count({
      where: { userId, status: 'Mastered' },
    });

    const grammarMasteryPercentage = totalGrammarProgress > 0 
      ? Math.round((masteredGrammar / totalGrammarProgress) * 100) 
      : 0;

    return {
      grammarProgress: {
        recent: grammarProgress,
        masteryPercentage: grammarMasteryPercentage,
        total: totalGrammarProgress,
        mastered: masteredGrammar,
      },
      vocabularyProgress: {
        recent: vocabularyProgress,
      },
      examAttempts: {
        recent: examAttempts,
      },
      learningPaths: {
        recent: learningPaths,
      },
    };
  }

  async getAdminStats() {
    const [
      newUsersThisWeek,
      newUsersThisMonth,
      activeUsers,
      totalExamAttempts,
      popularGrammars,
      popularVocabulary
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.examAttempt.count(),
      this.prisma.userGrammarProgress.groupBy({
        by: ['grammarId'],
        _count: {
          grammarId: true,
        },
        orderBy: {
          _count: {
            grammarId: 'desc',
          },
        },
        take: 5,
      }),
      this.prisma.userVocabularyProgress.groupBy({
        by: ['vocabularyId'],
        _count: {
          vocabularyId: true,
        },
        orderBy: {
          _count: {
            vocabularyId: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      users: {
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth,
        active: activeUsers,
      },
      exams: {
        totalAttempts: totalExamAttempts,
      },
      popular: {
        grammars: popularGrammars,
        vocabulary: popularVocabulary,
      },
    };
  }

  async getLearningPathProgress(userId: number) {
    const userPaths = await this.prisma.userLearningPath.findMany({
      where: { userId },
      include: {
        learningPath: {
          include: {
            pathSteps: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    const pathsWithProgress = userPaths.map(userPath => {
      const totalSteps = userPath.learningPath.pathSteps.length;
      const completedSteps = userPath.learningPath.pathSteps.filter(step => 
        step.contentType === 'Grammar' || step.contentType === 'Vocabulary'
      ).length;

      const progressPercentage = totalSteps > 0 
        ? Math.round((completedSteps / totalSteps) * 100) 
        : 0;

      return {
        pathId: userPath.learningPath.id,
        pathName: userPath.learningPath.pathName,
        targetLevel: userPath.learningPath.targetLevel,
        status: userPath.status,
        progress: progressPercentage,
        totalSteps,
        completedSteps,
        startedAt: userPath.startedAt,
        completedAt: userPath.completedAt,
      };
    });

    return pathsWithProgress;
  }
}
