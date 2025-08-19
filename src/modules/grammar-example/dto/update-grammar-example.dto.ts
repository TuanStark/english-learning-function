import { PartialType } from '@nestjs/swagger';
import { CreateGrammarExampleDto } from './create-grammar-example.dto';

export class UpdateGrammarExampleDto extends PartialType(CreateGrammarExampleDto) {}
