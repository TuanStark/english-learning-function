# Course Management API

## Overview
API endpoints for managing courses, sections, lessons, enrollments, progress, and payments.

## Endpoints

### 1. Course Management (`/courses`)

#### Create Course
- **POST** `/courses`
- **Body**: `CreateCourseDto`
- **Response**: Course with sections and enrollments

#### Get All Courses
- **GET** `/courses`
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `search` (string): Search in title/description
  - `level` (string): Filter by level
  - `language` (string): Filter by language
  - `isPublished` (boolean): Filter by published status
  - `minPrice` (number): Minimum price filter
  - `maxPrice` (number): Maximum price filter

#### Get Course by ID
- **GET** `/courses/:id`
- **Response**: Course with sections, lessons, and enrollments

#### Get Course by Slug
- **GET** `/courses/slug/:slug`
- **Response**: Course with sections and lessons

#### Update Course
- **PATCH** `/courses/:id`
- **Body**: `UpdateCourseDto`
- **Response**: Updated course

#### Delete Course
- **DELETE** `/courses/:id`
- **Response**: 204 No Content

#### Publish Course
- **PATCH** `/courses/:id/publish`
- **Response**: Updated course with published status

#### Unpublish Course
- **PATCH** `/courses/:id/unpublish`
- **Response**: Updated course with unpublished status

### 2. Course Section Management (`/course-sections`)

#### Create Section
- **POST** `/course-sections`
- **Body**: `CreateCourseSectionDto`
- **Response**: Section with course and lessons

#### Get All Sections
- **GET** `/course-sections`
- **Query Parameters**:
  - `courseId` (number): Filter by course ID

#### Get Section by ID
- **GET** `/course-sections/:id`
- **Response**: Section with course and lessons

#### Update Section
- **PATCH** `/course-sections/:id`
- **Body**: `UpdateCourseSectionDto`
- **Response**: Updated section

#### Delete Section
- **DELETE** `/course-sections/:id`
- **Response**: 204 No Content

#### Reorder Section
- **PATCH** `/course-sections/:id/reorder`
- **Body**: `{ orderIndex: number }`
- **Response**: Updated section

### 3. Course Lesson Management (`/course-lessons`)

#### Create Lesson
- **POST** `/course-lessons`
- **Body**: `CreateCourseLessonDto`
- **Response**: Lesson with section and course

#### Get All Lessons
- **GET** `/course-lessons`
- **Query Parameters**:
  - `sectionId` (number): Filter by section ID

#### Get Lesson by ID
- **GET** `/course-lessons/:id`
- **Response**: Lesson with section and course

#### Update Lesson
- **PATCH** `/course-lessons/:id`
- **Body**: `UpdateCourseLessonDto`
- **Response**: Updated lesson

#### Delete Lesson
- **DELETE** `/course-lessons/:id`
- **Response**: 204 No Content

#### Reorder Lesson
- **PATCH** `/course-lessons/:id/reorder`
- **Body**: `{ orderIndex: number }`
- **Response**: Updated lesson

#### Toggle Preview
- **PATCH** `/course-lessons/:id/toggle-preview`
- **Response**: Updated lesson with toggled preview status

### 4. Course Enrollment Management (`/course-enrollments`)

#### Create Enrollment
- **POST** `/course-enrollments`
- **Body**: `CreateCourseEnrollmentDto`
- **Response**: Enrollment with user and course

#### Get All Enrollments
- **GET** `/course-enrollments`
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `userId` (number): Filter by user ID
  - `courseId` (number): Filter by course ID
  - `status` (string): Filter by status
  - `isCompleted` (boolean): Filter by completion status

#### Get Enrollment Stats
- **GET** `/course-enrollments/stats`
- **Query Parameters**:
  - `courseId` (number): Filter by course ID
- **Response**: Enrollment statistics

#### Get Enrollment by User and Course
- **GET** `/course-enrollments/user/:userId/course/:courseId`
- **Response**: Enrollment with user and course

#### Get Enrollment by ID
- **GET** `/course-enrollments/:id`
- **Response**: Enrollment with user, course, and progress

#### Update Enrollment
- **PATCH** `/course-enrollments/:id`
- **Body**: `UpdateCourseEnrollmentDto`
- **Response**: Updated enrollment

#### Complete Enrollment
- **PATCH** `/course-enrollments/:id/complete`
- **Response**: Updated enrollment with completed status

#### Delete Enrollment
- **DELETE** `/course-enrollments/:id`
- **Response**: 204 No Content

### 5. Course Progress Management (`/course-progress`)

#### Create Progress
- **POST** `/course-progress`
- **Body**: `CreateCourseProgressDto`
- **Response**: Progress with enrollment and lesson

#### Get All Progress
- **GET** `/course-progress`
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `enrollmentId` (number): Filter by enrollment ID
  - `lessonId` (number): Filter by lesson ID
  - `isCompleted` (boolean): Filter by completion status

#### Get Progress Stats
- **GET** `/course-progress/stats/:enrollmentId`
- **Response**: Progress statistics for enrollment

#### Get Progress by Enrollment and Lesson
- **GET** `/course-progress/enrollment/:enrollmentId/lesson/:lessonId`
- **Response**: Progress with enrollment and lesson

#### Get Progress by ID
- **GET** `/course-progress/:id`
- **Response**: Progress with enrollment and lesson

#### Update Progress
- **PATCH** `/course-progress/:id`
- **Body**: `UpdateCourseProgressDto`
- **Response**: Updated progress

#### Mark as Completed
- **PATCH** `/course-progress/enrollment/:enrollmentId/lesson/:lessonId/complete`
- **Response**: Updated progress with completed status

#### Mark as Incomplete
- **PATCH** `/course-progress/enrollment/:enrollmentId/lesson/:lessonId/incomplete`
- **Response**: Updated progress with incomplete status

#### Delete Progress
- **DELETE** `/course-progress/:id`
- **Response**: 204 No Content

### 6. Payment Management (`/payments`)

#### Create Payment
- **POST** `/payments`
- **Body**: `CreatePaymentDto`
- **Response**: Payment with user and course

#### Get All Payments
- **GET** `/payments`
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `userId` (number): Filter by user ID
  - `courseId` (number): Filter by course ID
  - `status` (string): Filter by status
  - `paymentMethod` (string): Filter by payment method
  - `transactionId` (string): Filter by transaction ID
  - `minAmount` (number): Minimum amount filter
  - `maxAmount` (number): Maximum amount filter

#### Get Payment Stats
- **GET** `/payments/stats`
- **Query Parameters**:
  - `courseId` (number): Filter by course ID
- **Response**: Payment statistics

#### Get Payment by Transaction ID
- **GET** `/payments/transaction/:transactionId`
- **Response**: Payment with user and course

#### Get Payment by ID
- **GET** `/payments/:id`
- **Response**: Payment with user and course

#### Update Payment
- **PATCH** `/payments/:id`
- **Body**: `UpdatePaymentDto`
- **Response**: Updated payment

#### Mark as Completed
- **PATCH** `/payments/:id/complete`
- **Body**: `{ transactionId?: string }`
- **Response**: Updated payment with completed status (creates enrollment)

#### Mark as Failed
- **PATCH** `/payments/:id/fail`
- **Body**: `{ reason?: string }`
- **Response**: Updated payment with failed status

#### Refund Payment
- **PATCH** `/payments/:id/refund`
- **Body**: `{ reason?: string }`
- **Response**: Updated payment with refunded status

#### Delete Payment
- **DELETE** `/payments/:id`
- **Response**: 204 No Content

## Data Transfer Objects (DTOs)

### Course DTOs
- `CreateCourseDto`: title, slug, description, coverImage, price, discountPrice, level, language, isPublished, publishedAt
- `UpdateCourseDto`: Partial of CreateCourseDto
- `QueryCourseDto`: pagination, search, filters

### Course Section DTOs
- `CreateCourseSectionDto`: courseId, title, orderIndex
- `UpdateCourseSectionDto`: Partial of CreateCourseSectionDto

### Course Lesson DTOs
- `CreateCourseLessonDto`: sectionId, title, contentType, contentUrl, duration, orderIndex, isPreview
- `UpdateCourseLessonDto`: Partial of CreateCourseLessonDto

### Course Enrollment DTOs
- `CreateCourseEnrollmentDto`: userId, courseId, status, enrolledAt, completedAt
- `UpdateCourseEnrollmentDto`: Partial of CreateCourseEnrollmentDto
- `QueryCourseEnrollmentDto`: pagination, filters

### Course Progress DTOs
- `CreateCourseProgressDto`: enrollmentId, lessonId, isCompleted, completedAt
- `UpdateCourseProgressDto`: Partial of CreateCourseProgressDto
- `QueryCourseProgressDto`: pagination, filters

### Payment DTOs
- `CreatePaymentDto`: userId, courseId, amount, status, paymentMethod, transactionId, paidAt
- `UpdatePaymentDto`: Partial of CreatePaymentDto
- `QueryPaymentDto`: pagination, filters

## Features

### Course Management
- Full CRUD operations
- Search and filtering
- Publish/unpublish functionality
- Slug-based access
- Price management with discounts

### Section Management
- Hierarchical organization
- Order management
- Course association

### Lesson Management
- Content type support (Video, PDF, Quiz)
- Preview functionality
- Order management
- Duration tracking

### Enrollment Management
- User enrollment tracking
- Status management (InProgress, Completed)
- Statistics and analytics
- Progress tracking

### Progress Management
- Lesson completion tracking
- Progress statistics
- Completion percentage calculation
- Bulk operations

### Payment Management
- Payment processing
- Status tracking (Pending, Completed, Failed, Refunded)
- Transaction management
- Revenue analytics
- Automatic enrollment on successful payment

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK`: Successful GET/PATCH operations
- `201 Created`: Successful POST operations
- `204 No Content`: Successful DELETE operations
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors

Error responses include:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```
