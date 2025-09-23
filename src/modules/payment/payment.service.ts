import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createPaymentDto.userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createPaymentDto.courseId }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is already enrolled in the course
    const existingEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: createPaymentDto.userId,
          courseId: createPaymentDto.courseId
        }
      }
    });

    if (existingEnrollment) {
      throw new BadRequestException('User is already enrolled in this course');
    }

    // Check if there's already a pending payment for this user and course
    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        userId: createPaymentDto.userId,
        courseId: createPaymentDto.courseId,
        status: 'Pending'
      }
    });

    if (existingPayment) {
      throw new BadRequestException('There is already a pending payment for this course');
    }

    return this.prisma.payment.create({
      data: createPaymentDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        }
      }
    });
  }

  async findAll(query: QueryPaymentDto) {
    const { page = 1, limit = 10, userId, courseId, status, paymentMethod, transactionId, minAmount, maxAmount } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (status) {
      where.status = status;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (transactionId) {
      where.transactionId = transactionId;
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) {
        where.amount.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.amount.lte = maxAmount;
      }
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatar: true
            }
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true,
              price: true,
              discountPrice: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.payment.count({ where })
    ]);

    return {
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        }
      }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findByTransactionId(transactionId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { transactionId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        }
      }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const existingPayment = await this.prisma.payment.findUnique({
      where: { id }
    });

    if (!existingPayment) {
      throw new NotFoundException('Payment not found');
    }

    // Check if user exists (if updating userId)
    if (updatePaymentDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updatePaymentDto.userId }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    // Check if course exists (if updating courseId)
    if (updatePaymentDto.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: updatePaymentDto.courseId }
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const existingPayment = await this.prisma.payment.findUnique({
      where: { id }
    });

    if (!existingPayment) {
      throw new NotFoundException('Payment not found');
    }

    return this.prisma.payment.delete({
      where: { id }
    });
  }

  async markAsCompleted(id: number, transactionId?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === 'Completed') {
      throw new BadRequestException('Payment is already completed');
    }

    // Update payment status
    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: 'Completed',
        paidAt: new Date(),
        ...(transactionId && { transactionId })
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        }
      }
    });

    // Create enrollment after successful payment
    await this.prisma.courseEnrollment.create({
      data: {
        userId: payment.userId,
        courseId: payment.courseId,
        status: 'InProgress'
      }
    });

    return updatedPayment;
  }

  async markAsFailed(id: number, reason?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === 'Completed') {
      throw new BadRequestException('Cannot mark completed payment as failed');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: 'Failed',
        ...(reason && { transactionId: reason })
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        }
      }
    });
  }

  async refund(id: number, reason?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'Completed') {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: 'Refunded',
        ...(reason && { transactionId: reason })
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            price: true,
            discountPrice: true
          }
        }
      }
    });
  }

  async getPaymentStats(courseId?: number) {
    const where = courseId ? { courseId } : {};

    const [total, completed, pending, failed, refunded] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.count({
        where: { ...where, status: 'Completed' }
      }),
      this.prisma.payment.count({
        where: { ...where, status: 'Pending' }
      }),
      this.prisma.payment.count({
        where: { ...where, status: 'Failed' }
      }),
      this.prisma.payment.count({
        where: { ...where, status: 'Refunded' }
      })
    ]);

    const totalRevenue = await this.prisma.payment.aggregate({
      where: { ...where, status: 'Completed' },
      _sum: { amount: true }
    });

    return {
      total,
      completed,
      pending,
      failed,
      refunded,
      totalRevenue: totalRevenue._sum.amount || 0,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }
}
