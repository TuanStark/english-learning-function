import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(private prisma: PrismaService) {}

  async create(createBlogCommentDto: CreateBlogCommentDto) {
    // Kiểm tra xem post và user có tồn tại không
    const [post, user] = await Promise.all([
      this.prisma.blogPost.findUnique({
        where: { id: createBlogCommentDto.blogPostId },
      }),
      this.prisma.user.findUnique({
        where: { id: createBlogCommentDto.userId },
      }),
    ]);

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${createBlogCommentDto.blogPostId} not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${createBlogCommentDto.userId} not found`);
    }

    // Nếu có parentCommentId, kiểm tra parent comment có tồn tại không
    if (createBlogCommentDto.parentCommentId) {
      const parentComment = await this.prisma.blogComment.findUnique({
        where: { id: createBlogCommentDto.parentCommentId },
      });

      if (!parentComment) {
        throw new NotFoundException(`Parent comment with ID ${createBlogCommentDto.parentCommentId} not found`);
      }
    }

    return this.prisma.blogComment.create({
      data: createBlogCommentDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parentComment: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(blogPostId?: number, userId?: number, parentCommentId?: number) {
    const where: any = {};
    
    if (blogPostId) {
      where.blogPostId = blogPostId;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (parentCommentId !== undefined) {
      where.parentCommentId = parentCommentId;
    }

    return this.prisma.blogComment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parentComment: {
          select: {
            id: true,
            content: true,
          },
        },
        childComments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.blogComment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parentComment: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        childComments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Blog comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: number, updateBlogCommentDto: UpdateBlogCommentDto) {
    const existingComment = await this.prisma.blogComment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException(`Blog comment with ID ${id} not found`);
    }

    return this.prisma.blogComment.update({
      where: { id },
      data: updateBlogCommentDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        blogPost: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingComment = await this.prisma.blogComment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException(`Blog comment with ID ${id} not found`);
    }

    return this.prisma.blogComment.delete({
      where: { id },
    });
  }

  async findByPost(blogPostId: number) {
    return this.prisma.blogComment.findMany({
      where: { 
        blogPostId,
        parentCommentId: null, // Chỉ lấy comment gốc
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        childComments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.blogComment.findMany({
      where: { userId },
      include: {
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parentComment: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCommentStats(blogPostId: number) {
    const [totalComments, topLevelComments, replies] = await Promise.all([
      this.prisma.blogComment.count({
        where: { blogPostId },
      }),
      this.prisma.blogComment.count({
        where: { blogPostId, parentCommentId: null },
      }),
      this.prisma.blogComment.count({
        where: { blogPostId, parentCommentId: { not: null } },
      }),
    ]);

    return {
      totalComments,
      topLevelComments,
      replies,
    };
  }
}
