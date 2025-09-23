import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll(@Query() query: QueryPaymentDto) {
    return this.paymentService.findAll(query);
  }

  @Get('stats')
  getStats(@Query('courseId') courseId?: string) {
    const courseIdNumber = courseId ? parseInt(courseId, 10) : undefined;
    return this.paymentService.getPaymentStats(courseIdNumber);
  }

  @Get('transaction/:transactionId')
  findByTransactionId(@Param('transactionId') transactionId: string) {
    return this.paymentService.findByTransactionId(transactionId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Patch(':id/complete')
  markAsCompleted(
    @Param('id', ParseIntPipe) id: number,
    @Body('transactionId') transactionId?: string
  ) {
    return this.paymentService.markAsCompleted(id, transactionId);
  }

  @Patch(':id/fail')
  markAsFailed(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason?: string
  ) {
    return this.paymentService.markAsFailed(id, reason);
  }

  @Patch(':id/refund')
  refund(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason?: string
  ) {
    return this.paymentService.refund(id, reason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }
}
