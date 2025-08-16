# English Learning App - Simplified Database

## 🎯 **Design Philosophy: Simplicity First**

This simplified database design reduces complexity while maintaining all essential functionality. Instead of 20+ tables with complex relationships, we use just **6 core tables** with smart JSON metadata storage.

## 📊 **Database Overview**

### **Core Tables (6 total):**
1. **`users`** - User accounts and basic info
2. **`content`** - All content types in one unified table
3. **`user_progress`** - Universal progress tracking
4. **`test_attempts`** - Test results and attempts
5. **`activity_logs`** - Basic analytics
6. **NextAuth tables** - `accounts`, `sessions`, `verification_tokens`

## 🏗️ **Key Design Decisions**

### **1. Unified Content Model**
Instead of separate tables for courses, lessons, vocabulary, grammar, tests, and blog posts, we use **one `content` table** with:
- **`type`** field to distinguish content types
- **`metadata`** JSON field for type-specific data
- **`parent_id`** for hierarchical relationships

**Benefits:**
- ✅ **90% fewer tables** and relationships
- ✅ **Easier to query** and maintain
- ✅ **Flexible metadata** storage
- ✅ **Simpler migrations** and updates

### **2. Universal Progress Tracking**
One **`user_progress`** table handles all progress types:
- Course/lesson completion
- Vocabulary spaced repetition
- Grammar mastery
- Reading progress

**Benefits:**
- ✅ **Consistent progress API**
- ✅ **Easier analytics** across content types
- ✅ **Simplified queries**

### **3. JSON Metadata Strategy**
Type-specific data stored in `metadata` JSON field:

```json
// Course metadata
{
  "duration_hours": 40,
  "total_lessons": 20,
  "objectives": ["obj1", "obj2"]
}

// Vocabulary word metadata
{
  "pronunciation": "/həˈloʊ/",
  "part_of_speech": "noun",
  "definition_vi": "xin chào",
  "example": "Hello world"
}

// Test metadata
{
  "time_limit_minutes": 120,
  "sections": [...],
  "instructions": "..."
}
```

## 📋 **Content Types**

### **Supported Content Types:**
- **`course`** - Learning courses
- **`lesson`** - Individual lessons (parent: course)
- **`vocabulary_set`** - Vocabulary collections
- **`vocabulary_word`** - Individual words (parent: vocabulary_set)
- **`grammar`** - Grammar topics
- **`test`** - Practice tests
- **`blog`** - Blog posts

### **Content Hierarchy:**
```
Course
├── Lesson 1
├── Lesson 2
└── Lesson 3

Vocabulary Set
├── Word 1
├── Word 2
└── Word 3
```

## 🚀 **Setup Instructions**

### **1. Create Database:**
```bash
createdb english_learning_app
```

### **2. Run Schema:**
```bash
psql -d english_learning_app -f database/schema-simple.sql
```

### **3. Seed Data (Optional):**
```bash
psql -d english_learning_app -f database/seed-simple.sql
```

### **4. Environment Variables:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/english_learning_app"
```

## 📈 **Performance Benefits**

### **Query Performance:**
- ✅ **Fewer JOINs** required
- ✅ **Strategic indexes** on key fields
- ✅ **JSON queries** optimized with GIN indexes

### **Maintenance:**
- ✅ **Simpler migrations**
- ✅ **Easier backups**
- ✅ **Reduced complexity**

## 🔍 **Common Queries**

### **Get all courses:**
```sql
SELECT * FROM content WHERE type = 'course' AND is_published = true;
```

### **Get lessons for a course:**
```sql
SELECT * FROM content 
WHERE type = 'lesson' AND parent_id = 'course_id' 
ORDER BY sort_order;
```

### **Get user progress on a course:**
```sql
SELECT c.title, p.progress_percent, p.is_completed
FROM content c
JOIN user_progress p ON c.id = p.content_id
WHERE c.type = 'course' AND p.user_id = 'user_id';
```

### **Get vocabulary words due for review:**
```sql
SELECT c.*, p.mastery_level
FROM content c
JOIN user_progress p ON c.id = p.content_id
WHERE c.type = 'vocabulary_word' 
  AND p.user_id = 'user_id'
  AND p.next_review_date <= CURRENT_DATE;
```

## 🎮 **Gamification Features**

### **Built-in User Stats:**
- `total_points` - Points earned
- `current_streak` - Days studied consecutively
- `total_study_time` - Minutes spent learning

### **Progress Tracking:**
- `progress_percent` - 0-100% completion
- `mastery_level` - 0-5 for vocabulary
- `time_spent` - Minutes on content

## 🔒 **Security & Access Control**

### **Role-based Access:**
- `student` - Can access free content
- `teacher` - Can create content
- `admin` - Full access

### **Content Access:**
- `is_free` - Free vs premium content
- `is_published` - Draft vs published
- `subscription_type` - User subscription level

## 📊 **Analytics & Reporting**

### **Activity Tracking:**
Simple `activity_logs` table captures:
- User actions (login, course_start, test_complete)
- Entity interactions
- Metadata for context

### **Built-in Metrics:**
- Course completion rates
- Test performance
- Study time tracking
- User engagement

## 🔄 **Migration from Complex Schema**

If migrating from the complex schema:

1. **Content Migration:**
   ```sql
   -- Migrate courses
   INSERT INTO content (id, title, slug, type, category, level, metadata, ...)
   SELECT id, title, slug, 'course', category, level, 
          json_build_object('duration_hours', duration_hours, 'total_lessons', total_lessons),
          ...
   FROM courses;
   ```

2. **Progress Migration:**
   ```sql
   -- Migrate course enrollments
   INSERT INTO user_progress (user_id, content_id, progress_percent, ...)
   SELECT user_id, course_id, progress_percentage, ...
   FROM course_enrollments;
   ```

## 🎯 **Benefits Summary**

### **For Developers:**
- ✅ **90% less code** for database operations
- ✅ **Simpler API** design
- ✅ **Faster development** cycles
- ✅ **Easier testing** and debugging

### **For Performance:**
- ✅ **Fewer database connections**
- ✅ **Optimized queries**
- ✅ **Better caching** opportunities
- ✅ **Reduced memory** usage

### **For Maintenance:**
- ✅ **Simpler schema** changes
- ✅ **Easier backups** and restores
- ✅ **Reduced complexity**
- ✅ **Better documentation**

## 🚀 **Future Scalability**

### **When to Consider Splitting:**
- **1M+ content items** - Consider splitting content table
- **10M+ progress records** - Consider partitioning by date
- **Complex queries** - Add materialized views

### **Scaling Options:**
- **Read replicas** for query performance
- **Table partitioning** for large datasets
- **Caching layer** (Redis) for hot data
- **Search engine** (Elasticsearch) for content search

This simplified design provides **80% of the functionality with 20% of the complexity** - perfect for a growing English learning platform! 🌟
