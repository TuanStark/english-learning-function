-- CreateTable
CREATE TABLE "public"."roles" (
    "id" SERIAL NOT NULL,
    "roleName" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "avatar" VARCHAR(500),
    "dateOfBirth" TIMESTAMP(3),
    "gender" VARCHAR(10),
    "phoneNumber" VARCHAR(20),
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "roleId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "codeId" TEXT,
    "codeExpired" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."exams" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "difficulty" VARCHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "questionType" VARCHAR(50) NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."answer_options" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "optionLabel" VARCHAR(1) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."exam_attempts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "timeSpent" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'InProgress',
    "detailedResult" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vocabulary_topics" (
    "id" SERIAL NOT NULL,
    "topicName" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vocabularies" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "englishWord" VARCHAR(100) NOT NULL,
    "pronunciation" VARCHAR(100),
    "vietnameseMeaning" TEXT NOT NULL,
    "wordType" VARCHAR(50),
    "difficultyLevel" VARCHAR(20) NOT NULL DEFAULT 'Easy',
    "image" VARCHAR(500),
    "audioFile" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vocabulary_examples" (
    "id" SERIAL NOT NULL,
    "vocabularyId" INTEGER NOT NULL,
    "englishSentence" TEXT NOT NULL,
    "vietnameseSentence" TEXT NOT NULL,
    "audioFile" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."grammar" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "difficultyLevel" VARCHAR(20) NOT NULL DEFAULT 'Easy',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grammar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."grammar_examples" (
    "id" SERIAL NOT NULL,
    "grammarId" INTEGER NOT NULL,
    "englishSentence" TEXT NOT NULL,
    "vietnameseSentence" TEXT NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grammar_examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_paths" (
    "id" SERIAL NOT NULL,
    "pathName" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "coverImage" VARCHAR(500),
    "targetLevel" VARCHAR(50) NOT NULL,
    "estimatedWeeks" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."path_steps" (
    "id" SERIAL NOT NULL,
    "learningPathId" INTEGER NOT NULL,
    "stepName" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "contentType" VARCHAR(50) NOT NULL,
    "contentId" INTEGER,
    "orderIndex" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "estimatedMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "path_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_learning_paths" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "learningPathId" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'InProgress',
    "progress" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_categories" (
    "id" SERIAL NOT NULL,
    "categoryName" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "slug" VARCHAR(150) NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "slug" VARCHAR(350) NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" VARCHAR(500),
    "authorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Draft',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "seoKeywords" VARCHAR(300),
    "seoDescription" VARCHAR(500),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_comments" (
    "id" SERIAL NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "parentCommentId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_vocabulary_progress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "vocabularyId" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Learning',
    "masteryLevel" INTEGER NOT NULL DEFAULT 0,
    "timesPracticed" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMP(3),
    "firstLearnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_vocabulary_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_grammar_progress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "grammarId" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Learning',
    "masteryLevel" INTEGER NOT NULL DEFAULT 0,
    "timesPracticed" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMP(3),
    "firstLearnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_grammar_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_explanations" (
    "id" SERIAL NOT NULL,
    "examAttemptId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_explanations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_roleName_key" ON "public"."roles"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_learning_paths_userId_learningPathId_key" ON "public"."user_learning_paths"("userId", "learningPathId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "public"."blog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_vocabulary_progress_userId_vocabularyId_key" ON "public"."user_vocabulary_progress"("userId", "vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_grammar_progress_userId_grammarId_key" ON "public"."user_grammar_progress"("userId", "grammarId");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer_options" ADD CONSTRAINT "answer_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exam_attempts" ADD CONSTRAINT "exam_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exam_attempts" ADD CONSTRAINT "exam_attempts_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabularies" ADD CONSTRAINT "vocabularies_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."vocabulary_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_examples" ADD CONSTRAINT "vocabulary_examples_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "public"."vocabularies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."grammar_examples" ADD CONSTRAINT "grammar_examples_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "public"."grammar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."path_steps" ADD CONSTRAINT "path_steps_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "public"."learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_learning_paths" ADD CONSTRAINT "user_learning_paths_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_learning_paths" ADD CONSTRAINT "user_learning_paths_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "public"."learning_paths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."blog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comments" ADD CONSTRAINT "blog_comments_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comments" ADD CONSTRAINT "blog_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comments" ADD CONSTRAINT "blog_comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "public"."blog_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_vocabulary_progress" ADD CONSTRAINT "user_vocabulary_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_vocabulary_progress" ADD CONSTRAINT "user_vocabulary_progress_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "public"."vocabularies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_grammar_progress" ADD CONSTRAINT "user_grammar_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_grammar_progress" ADD CONSTRAINT "user_grammar_progress_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "public"."grammar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_explanations" ADD CONSTRAINT "ai_explanations_examAttemptId_fkey" FOREIGN KEY ("examAttemptId") REFERENCES "public"."exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_explanations" ADD CONSTRAINT "ai_explanations_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
