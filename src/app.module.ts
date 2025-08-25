import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { VocabulariesModule } from './modules/vocabularies/vocabularies.module';
import { UserVocabulariesProgressModule } from './modules/user-vocabularies-progress/user-vocabularies-progress.module';
import { VocabularyTopicModule } from './modules/vocabulary-topic/vocabulary-topic.module';
import { VocabularyExampleModule } from './modules/vocabulary-example/vocabulary-example.module';
import { RoleModule } from './modules/role/role.module';
import { ExamModule } from './modules/exam/exam.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerOptionModule } from './modules/answer-option/answer-option.module';
import { GrammarModule } from './modules/grammar/grammar.module';
import { BlogCategoryModule } from './modules/blog-category/blog-category.module';
import { ExamAttemptModule } from './modules/exam-attempt/exam-attempt.module';
import { GrammarExampleModule } from './modules/grammar-example/grammar-example.module';
import { UserGrammarProgressModule } from './modules/user-grammar-progress/user-grammar-progress.module';
import { AIExplanationModule } from './modules/ai-explanation/ai-explanation.module';
import { BlogPostModule } from './modules/blog-post/blog-post.module';
import { BlogCommentModule } from './modules/blog-comment/blog-comment.module';
import { LearningPathModule } from './modules/learning-path/learning-path.module';
import { PathStepModule } from './modules/path-step/path-step.module';
import { UserLearningPathModule } from './modules/user-learning-path/user-learning-path.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + '/src/common/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],

    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    CloudinaryModule,
    VocabulariesModule,
    UserVocabulariesProgressModule,
    VocabularyTopicModule,
    VocabularyExampleModule,
    RoleModule,
    ExamModule,
    QuestionModule,
    AnswerOptionModule,
    GrammarModule,
    BlogCategoryModule,
    ExamAttemptModule,
    GrammarExampleModule,
    UserGrammarProgressModule,
    AIExplanationModule,
    BlogPostModule,
    BlogCommentModule,
    LearningPathModule,
    PathStepModule,
    UserLearningPathModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
