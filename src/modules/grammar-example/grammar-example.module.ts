import { Module } from '@nestjs/common';
import { GrammarExampleService } from './grammar-example.service';
import { GrammarExampleController } from './grammar-example.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GrammarExampleController],
  providers: [GrammarExampleService],
  exports: [GrammarExampleService],
})
export class GrammarExampleModule {}
