-- English Learning App - Simplified Database Schema
-- Optimized for simplicity and performance

-- =============================================
-- CORE USER MANAGEMENT
-- =============================================

-- Users table - Simplified
CREATE TABLE users (
    id VARCHAR(30) PRIMARY KEY, -- cuid
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    
    -- Learning basics
    current_level VARCHAR(20) DEFAULT 'beginner',
    target_score INTEGER,
    
    -- Subscription
    subscription_type VARCHAR(20) DEFAULT 'free',
    
    -- Role
    role VARCHAR(20) DEFAULT 'student',
    
    -- Simple stats
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    total_study_time INTEGER DEFAULT 0, -- minutes
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- NextAuth.js required tables
CREATE TABLE accounts (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    
    UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
    id VARCHAR(30) PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL
);

CREATE TABLE verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires TIMESTAMP NOT NULL,
    
    PRIMARY KEY (identifier, token)
);

-- =============================================
-- UNIFIED CONTENT MODEL
-- =============================================

-- All content types in one table - much simpler!
CREATE TABLE content (
    id VARCHAR(30) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    
    -- Content type and category
    type VARCHAR(50) NOT NULL, -- course, lesson, vocabulary_set, vocabulary_word, grammar, test, blog
    category VARCHAR(50), -- toeic, ielts, business, general
    level VARCHAR(20), -- beginner, intermediate, advanced
    
    -- Metadata as JSON for flexibility
    metadata JSONB,
    
    -- Media
    thumbnail TEXT,
    audio_url TEXT,
    video_url TEXT,
    
    -- Hierarchy (for lessons in courses, words in sets, etc.)
    parent_id VARCHAR(30) REFERENCES content(id),
    sort_order INTEGER DEFAULT 0,
    
    -- Access control
    is_free BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Creator
    created_by VARCHAR(30) REFERENCES users(id)
);

-- =============================================
-- SIMPLIFIED PROGRESS TRACKING
-- =============================================

-- Universal progress tracking
CREATE TABLE user_progress (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id VARCHAR(30) NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    
    -- Progress data
    is_completed BOOLEAN DEFAULT false,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    time_spent INTEGER DEFAULT 0, -- minutes
    
    -- Spaced repetition (for vocabulary)
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
    next_review_date DATE,
    review_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP,
    
    UNIQUE(user_id, content_id)
);

-- =============================================
-- SIMPLIFIED TESTING
-- =============================================

-- Test attempts
CREATE TABLE test_attempts (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id VARCHAR(30) NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    
    -- Results
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    
    -- Timing
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    time_spent INTEGER, -- minutes
    
    -- Answers as JSON
    answers JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SIMPLE ANALYTICS
-- =============================================

-- Basic activity tracking
CREATE TABLE activity_logs (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- login, course_start, test_complete, etc.
    entity_type VARCHAR(50), -- content, user, etc.
    entity_id VARCHAR(30),
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_type);
CREATE INDEX idx_users_role ON users(role);

-- Content indexes
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_category ON content(category);
CREATE INDEX idx_content_level ON content(level);
CREATE INDEX idx_content_parent ON content(parent_id);
CREATE INDEX idx_content_published ON content(is_published);
CREATE INDEX idx_content_featured ON content(is_featured);
CREATE INDEX idx_content_creator ON content(created_by);

-- Progress indexes
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_content ON user_progress(content_id);
CREATE INDEX idx_user_progress_completed ON user_progress(is_completed);
CREATE INDEX idx_user_progress_review_date ON user_progress(next_review_date);

-- Test attempt indexes
CREATE INDEX idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX idx_test_attempts_content ON test_attempts(content_id);
CREATE INDEX idx_test_attempts_date ON test_attempts(created_at);

-- Activity log indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_date ON activity_logs(created_at);

-- =============================================
-- TRIGGERS FOR AUTO-UPDATES
-- =============================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at 
    BEFORE UPDATE ON content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA STRUCTURE
-- =============================================

-- Content types and their metadata structure:

-- Course: { "duration_hours": 40, "total_lessons": 20, "objectives": ["obj1", "obj2"] }
-- Lesson: { "duration_minutes": 45, "video_url": "...", "attachments": [...] }
-- Vocabulary Set: { "word_count": 100, "difficulty": "intermediate" }
-- Vocabulary Word: { "pronunciation": "/həˈloʊ/", "part_of_speech": "noun", "definition_vi": "xin chào", "example": "Hello world" }
-- Grammar Topic: { "rules": ["rule1", "rule2"], "examples": [...] }
-- Test: { "time_limit_minutes": 120, "sections": [...], "instructions": "..." }
-- Blog Post: { "excerpt": "...", "tags": ["tag1", "tag2"], "reading_time": 5 }

-- This unified approach reduces complexity while maintaining flexibility!
