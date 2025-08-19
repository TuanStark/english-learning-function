# Vocabulary Management API Guide

Hướng dẫn sử dụng các API để quản lý từ vựng trong hệ thống học tiếng Anh.

## Mối quan hệ giữa các bảng

```
VocabularyTopic (1) -----> (n) Vocabulary (1) -----> (n) VocabularyExample
                                    |
                                    | (1)
                                    v
                                   (n) UserVocabularyProgress (n) <----- (1) User
```

## 1. Vocabulary Topics API

### Endpoints:
- `GET /vocabulary-topics` - Lấy danh sách chủ đề
- `GET /vocabulary-topics/:id` - Lấy chi tiết chủ đề
- `GET /vocabulary-topics/:id/stats` - Lấy thống kê chủ đề
- `POST /vocabulary-topics` - Tạo chủ đề mới
- `PATCH /vocabulary-topics/:id` - Cập nhật chủ đề
- `DELETE /vocabulary-topics/:id` - Xóa chủ đề

### Ví dụ tạo chủ đề:
```json
POST /vocabulary-topics
{
  "topicName": "Family & Relationships",
  "description": "Từ vựng về gia đình và các mối quan hệ",
  "image": "https://example.com/family.jpg",
  "orderIndex": 1,
  "isActive": true
}
```

## 2. Vocabularies API

### Endpoints:
- `GET /vocabularies` - Lấy danh sách từ vựng
- `GET /vocabularies/search?q=family` - Tìm kiếm từ vựng
- `GET /vocabularies/topic/:topicId` - Lấy từ vựng theo chủ đề
- `GET /vocabularies/:id` - Lấy chi tiết từ vựng
- `POST /vocabularies` - Tạo từ vựng mới
- `PATCH /vocabularies/:id` - Cập nhật từ vựng
- `DELETE /vocabularies/:id` - Xóa từ vựng

### Query Parameters:
- `topicId`: Lọc theo ID chủ đề
- `difficultyLevel`: Lọc theo mức độ (Easy, Medium, Hard)
- `includeInactive`: Bao gồm từ vựng không hoạt động

### Ví dụ tạo từ vựng:
```json
POST /vocabularies
{
  "topicId": 1,
  "englishWord": "family",
  "pronunciation": "/ˈfæməli/",
  "vietnameseMeaning": "gia đình",
  "wordType": "Noun",
  "difficultyLevel": "Easy",
  "image": "https://example.com/family.jpg",
  "audioFile": "https://example.com/family.mp3",
  "isActive": true
}
```

## 3. Vocabulary Examples API

### Endpoints:
- `GET /vocabulary-examples` - Lấy danh sách ví dụ
- `GET /vocabulary-examples/vocabulary/:vocabularyId` - Lấy ví dụ theo từ vựng
- `GET /vocabulary-examples/:id` - Lấy chi tiết ví dụ
- `POST /vocabulary-examples` - Tạo ví dụ mới
- `PATCH /vocabulary-examples/:id` - Cập nhật ví dụ
- `DELETE /vocabulary-examples/:id` - Xóa ví dụ

### Ví dụ tạo ví dụ:
```json
POST /vocabulary-examples
{
  "vocabularyId": 1,
  "englishSentence": "My family is very important to me.",
  "vietnameseSentence": "Gia đình tôi rất quan trọng với tôi.",
  "audioFile": "https://example.com/family-example.mp3"
}
```

## 4. User Vocabulary Progress API

### Endpoints:
- `GET /user-vocabularies-progress` - Lấy danh sách tiến độ
- `GET /user-vocabularies-progress/user/:userId` - Lấy tiến độ theo user
- `GET /user-vocabularies-progress/user/:userId/stats` - Lấy thống kê user
- `GET /user-vocabularies-progress/:id` - Lấy chi tiết tiến độ
- `POST /user-vocabularies-progress` - Tạo tiến độ mới
- `POST /user-vocabularies-progress/practice` - Cập nhật tiến độ sau luyện tập
- `PATCH /user-vocabularies-progress/:id` - Cập nhật tiến độ
- `DELETE /user-vocabularies-progress/:id` - Xóa tiến độ

### Query Parameters:
- `userId`: Lọc theo ID người dùng
- `vocabularyId`: Lọc theo ID từ vựng
- `status`: Lọc theo trạng thái (Learning, Mastered, NeedsReview)

### Ví dụ tạo tiến độ:
```json
POST /user-vocabularies-progress
{
  "userId": 1,
  "vocabularyId": 1,
  "status": "Learning",
  "masteryLevel": 0,
  "timesPracticed": 0
}
```

### Ví dụ cập nhật tiến độ sau luyện tập:
```json
POST /user-vocabularies-progress/practice
{
  "userId": 1,
  "vocabularyId": 1,
  "practiceResult": true
}
```

## Workflow sử dụng

1. **Tạo chủ đề từ vựng**: Sử dụng POST `/vocabulary-topics`
2. **Thêm từ vựng vào chủ đề**: Sử dụng POST `/vocabularies`
3. **Thêm ví dụ cho từ vựng**: Sử dụng POST `/vocabulary-examples`
4. **Theo dõi tiến độ học**: Sử dụng POST `/user-vocabularies-progress`
5. **Cập nhật tiến độ khi luyện tập**: Sử dụng POST `/user-vocabularies-progress/practice`

## Trạng thái tiến độ học

- **Learning**: Đang học (mặc định)
- **Mastered**: Đã thành thạo (masteryLevel >= 80)
- **NeedsReview**: Cần ôn tập (masteryLevel < 50 sau khi đã Mastered)

## Mức độ thành thạo (masteryLevel)

- Tăng 10 điểm khi trả lời đúng
- Giảm 5 điểm khi trả lời sai
- Phạm vi: 0-100
- Tự động chuyển trạng thái dựa trên điểm số

## Swagger Documentation

Truy cập `/api` để xem tài liệu API chi tiết với Swagger UI.
