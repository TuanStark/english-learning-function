-- English Learning App - Simplified Seed Data

-- =============================================
-- SAMPLE USERS
-- =============================================

INSERT INTO users (id, email, name, role, current_level, target_score, subscription_type) VALUES
('user_admin_001', 'admin@englishmaster.com', 'Admin User', 'admin', 'advanced', 950, 'free'),
('user_teacher_001', 'teacher@englishmaster.com', 'Teacher User', 'teacher', 'advanced', 900, 'free'),
('user_student_001', 'student@englishmaster.com', 'Student User', 'student', 'intermediate', 800, 'free');

-- =============================================
-- CONTENT - COURSES
-- =============================================

-- TOEIC Course
INSERT INTO content (id, title, slug, description, type, category, level, metadata, is_featured, created_by) VALUES
('course_toeic_001', 
 'TOEIC Complete Course', 
 'toeic-complete-course',
 'Comprehensive TOEIC preparation covering all sections with practice tests and strategies.',
 'course',
 'toeic',
 'intermediate',
 '{"duration_hours": 40, "total_lessons": 20, "objectives": ["Master TOEIC format", "Improve listening skills", "Enhance reading comprehension", "Achieve target score"]}',
 true,
 'user_teacher_001');

-- IELTS Course
INSERT INTO content (id, title, slug, description, type, category, level, metadata, is_featured, created_by) VALUES
('course_ielts_001',
 'IELTS Academic Preparation',
 'ielts-academic-preparation',
 'Complete IELTS Academic test preparation with all four skills.',
 'course',
 'ielts',
 'intermediate',
 '{"duration_hours": 35, "total_lessons": 18, "objectives": ["Master IELTS format", "Improve all four skills", "Practice with real tests"]}',
 true,
 'user_teacher_001');

-- =============================================
-- CONTENT - LESSONS
-- =============================================

-- TOEIC Lessons
INSERT INTO content (id, title, slug, description, content, type, category, level, parent_id, sort_order, metadata, created_by) VALUES
('lesson_toeic_001',
 'TOEIC Introduction and Format',
 'toeic-introduction-format',
 'Learn about TOEIC test format, sections, and scoring system.',
 '# TOEIC Test Overview\n\nThe TOEIC test measures English proficiency in business contexts...',
 'lesson',
 'toeic',
 'intermediate',
 'course_toeic_001',
 1,
 '{"duration_minutes": 45, "video_url": "https://example.com/video1.mp4"}',
 'user_teacher_001'),

('lesson_toeic_002',
 'Listening Section Strategies',
 'listening-section-strategies',
 'Master effective strategies for TOEIC listening section.',
 '# Listening Strategies\n\nKey strategies for success in TOEIC listening...',
 'lesson',
 'toeic',
 'intermediate',
 'course_toeic_001',
 2,
 '{"duration_minutes": 60, "audio_url": "https://example.com/audio1.mp3"}',
 'user_teacher_001'),

('lesson_toeic_003',
 'Reading Section Techniques',
 'reading-section-techniques',
 'Learn time management and comprehension techniques for reading.',
 '# Reading Techniques\n\nEffective approaches to TOEIC reading section...',
 'lesson',
 'toeic',
 'intermediate',
 'course_toeic_001',
 3,
 '{"duration_minutes": 60}',
 'user_teacher_001');

-- =============================================
-- CONTENT - VOCABULARY SETS
-- =============================================

-- TOEIC Vocabulary Set
INSERT INTO content (id, title, slug, description, type, category, level, metadata, is_featured, created_by) VALUES
('vocab_set_toeic_001',
 'TOEIC Essential Vocabulary',
 'toeic-essential-vocabulary',
 'Most important vocabulary words for TOEIC test success.',
 'vocabulary_set',
 'toeic',
 'intermediate',
 '{"word_count": 500, "difficulty": "intermediate"}',
 true,
 'user_teacher_001');

-- Business Vocabulary Set
INSERT INTO content (id, title, slug, description, type, category, level, metadata, is_featured, created_by) VALUES
('vocab_set_business_001',
 'Business English Words',
 'business-english-words',
 'Essential vocabulary for business communication.',
 'vocabulary_set',
 'business',
 'intermediate',
 '{"word_count": 300, "difficulty": "intermediate"}',
 true,
 'user_teacher_001');

-- =============================================
-- CONTENT - VOCABULARY WORDS
-- =============================================

-- TOEIC Vocabulary Words
INSERT INTO content (id, title, slug, description, type, category, level, parent_id, sort_order, metadata, created_by) VALUES
('vocab_word_001',
 'accomplish',
 'accomplish',
 'to succeed in doing or completing something',
 'vocabulary_word',
 'toeic',
 'intermediate',
 'vocab_set_toeic_001',
 1,
 '{"pronunciation": "/əˈkʌmplɪʃ/", "part_of_speech": "verb", "definition_vi": "hoàn thành, đạt được", "example": "She was able to accomplish her goals within the deadline.", "example_translation": "Cô ấy đã có thể hoàn thành mục tiêu trong thời hạn."}',
 'user_teacher_001'),

('vocab_word_002',
 'efficient',
 'efficient',
 'working in a well-organized way; competent',
 'vocabulary_word',
 'toeic',
 'intermediate',
 'vocab_set_toeic_001',
 2,
 '{"pronunciation": "/ɪˈfɪʃənt/", "part_of_speech": "adjective", "definition_vi": "hiệu quả, có năng suất", "example": "The new system is more efficient than the old one.", "example_translation": "Hệ thống mới hiệu quả hơn hệ thống cũ."}',
 'user_teacher_001'),

('vocab_word_003',
 'negotiate',
 'negotiate',
 'to discuss something with someone in order to reach an agreement',
 'vocabulary_word',
 'business',
 'intermediate',
 'vocab_set_business_001',
 1,
 '{"pronunciation": "/nɪˈɡoʊʃieɪt/", "part_of_speech": "verb", "definition_vi": "đàm phán, thương lượng", "example": "The companies are negotiating a new contract.", "example_translation": "Các công ty đang đàm phán một hợp đồng mới."}',
 'user_teacher_001');

-- =============================================
-- CONTENT - GRAMMAR TOPICS
-- =============================================

INSERT INTO content (id, title, slug, description, content, type, category, level, metadata, is_featured, created_by) VALUES
('grammar_001',
 'Present Simple Tense',
 'present-simple-tense',
 'Learn how to use present simple tense correctly.',
 '# Present Simple Tense\n\nThe present simple tense is used to describe habits, facts, and general truths...',
 'grammar',
 'general',
 'beginner',
 '{"rules": ["Use base form for I/you/we/they", "Add -s/-es for he/she/it", "Use do/does for questions"], "examples": ["I work every day", "She works in an office", "Do you like coffee?"]}',
 true,
 'user_teacher_001'),

('grammar_002',
 'Past Perfect Tense',
 'past-perfect-tense',
 'Master the past perfect tense for advanced communication.',
 '# Past Perfect Tense\n\nThe past perfect tense shows that something happened before another action in the past...',
 'grammar',
 'general',
 'advanced',
 '{"rules": ["had + past participle", "Shows completed action before another past action"], "examples": ["I had finished my work before he arrived", "She had already left when I called"]}',
 false,
 'user_teacher_001');

-- =============================================
-- CONTENT - PRACTICE TESTS
-- =============================================

INSERT INTO content (id, title, slug, description, type, category, level, metadata, is_featured, created_by) VALUES
('test_toeic_001',
 'TOEIC Practice Test 1',
 'toeic-practice-test-1',
 'Full-length TOEIC practice test with listening and reading sections.',
 'test',
 'toeic',
 'intermediate',
 '{"time_limit_minutes": 120, "total_questions": 200, "sections": [{"name": "Listening", "questions": 100, "time_minutes": 45}, {"name": "Reading", "questions": 100, "time_minutes": 75}], "instructions": "This is a full TOEIC practice test..."}',
 true,
 'user_teacher_001'),

('test_ielts_001',
 'IELTS Reading Practice',
 'ielts-reading-practice',
 'IELTS Academic reading practice with 3 passages.',
 'test',
 'ielts',
 'intermediate',
 '{"time_limit_minutes": 60, "total_questions": 40, "sections": [{"name": "Reading", "questions": 40, "passages": 3}], "instructions": "Read the passages and answer the questions..."}',
 true,
 'user_teacher_001');

-- =============================================
-- CONTENT - BLOG POSTS
-- =============================================

INSERT INTO content (id, title, slug, description, content, type, category, level, metadata, is_featured, created_by) VALUES
('blog_001',
 '10 Tips for TOEIC Success',
 '10-tips-toeic-success',
 'Discover proven strategies to improve your TOEIC score quickly and effectively.',
 '# 10 Tips for TOEIC Success\n\nPreparing for the TOEIC test can be challenging, but with the right strategies...',
 'blog',
 'toeic',
 null,
 '{"excerpt": "Discover proven strategies to improve your TOEIC score quickly and effectively.", "tags": ["toeic", "tips", "strategy"], "reading_time": 5}',
 true,
 'user_teacher_001'),

('blog_002',
 'How to Improve English Listening Skills',
 'improve-english-listening-skills',
 'Effective methods to enhance your English listening comprehension.',
 '# How to Improve English Listening Skills\n\nListening is one of the most important skills in English learning...',
 'blog',
 'general',
 null,
 '{"excerpt": "Effective methods to enhance your English listening comprehension.", "tags": ["listening", "skills", "improvement"], "reading_time": 7}',
 false,
 'user_teacher_001');

-- =============================================
-- SAMPLE PROGRESS DATA
-- =============================================

-- Student progress on TOEIC course
INSERT INTO user_progress (id, user_id, content_id, is_completed, progress_percent, time_spent, started_at, last_accessed_at) VALUES
('progress_001', 'user_student_001', 'course_toeic_001', false, 60, 120, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('progress_002', 'user_student_001', 'lesson_toeic_001', true, 100, 45, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '6 days'),
('progress_003', 'user_student_001', 'lesson_toeic_002', true, 100, 60, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('progress_004', 'user_student_001', 'lesson_toeic_003', false, 30, 20, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Vocabulary progress with spaced repetition
INSERT INTO user_progress (id, user_id, content_id, mastery_level, review_count, correct_count, next_review_date, last_accessed_at) VALUES
('progress_vocab_001', 'user_student_001', 'vocab_word_001', 3, 5, 4, CURRENT_DATE + INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('progress_vocab_002', 'user_student_001', 'vocab_word_002', 2, 3, 2, CURRENT_DATE + INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('progress_vocab_003', 'user_student_001', 'vocab_word_003', 1, 2, 1, CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '3 days');

-- =============================================
-- SAMPLE TEST ATTEMPTS
-- =============================================

INSERT INTO test_attempts (id, user_id, content_id, score, max_score, percentage, correct_answers, total_questions, started_at, completed_at, time_spent, answers) VALUES
('attempt_001', 'user_student_001', 'test_toeic_001', 750, 990, 76, 152, 200, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '110 minutes', 110, '{"listening": {"correct": 75, "total": 100}, "reading": {"correct": 77, "total": 100}}'),
('attempt_002', 'user_student_001', 'test_ielts_001', 32, 40, 80, 32, 40, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '55 minutes', 55, '{"passage1": {"correct": 12, "total": 13}, "passage2": {"correct": 10, "total": 13}, "passage3": {"correct": 10, "total": 14}}');

-- =============================================
-- SAMPLE ACTIVITY LOGS
-- =============================================

INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, metadata) VALUES
('log_001', 'user_student_001', 'login', 'user', 'user_student_001', '{"ip": "192.168.1.1", "device": "desktop"}'),
('log_002', 'user_student_001', 'course_start', 'content', 'course_toeic_001', '{"source": "homepage"}'),
('log_003', 'user_student_001', 'lesson_complete', 'content', 'lesson_toeic_001', '{"time_spent": 45}'),
('log_004', 'user_student_001', 'test_complete', 'content', 'test_toeic_001', '{"score": 750, "time_spent": 110}'),
('log_005', 'user_student_001', 'vocabulary_review', 'content', 'vocab_word_001', '{"result": "correct", "time_spent": 30});
