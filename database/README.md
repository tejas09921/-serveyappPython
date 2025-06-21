# Database - Survey Application

MySQL database schema and seed data for the survey application.

## Database Design

The database follows a normalized design pattern with proper relationships and constraints using MySQL.

### Entity Relationship Diagram

```
surveys (1) -----> (*) questions (1) -----> (*) question_options
   |                      |
   |                      |
   v                      v
responses (*) ---------> (*) answers
```

### Table Specifications

#### surveys
Stores survey metadata and status information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | Unique survey identifier (UUID) |
| title | VARCHAR(255) | NOT NULL | Survey title |
| description | TEXT | | Optional survey description |
| status | ENUM('draft', 'live') | DEFAULT 'draft' | Survey publication status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### questions
Stores individual questions for each survey.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | Unique question identifier (UUID) |
| survey_id | VARCHAR(36) | FOREIGN KEY REFERENCES surveys(id) ON DELETE CASCADE | Parent survey |
| question_text | TEXT | NOT NULL | The question content |
| question_type | ENUM('single_choice', 'multiple_choice', 'text') | NOT NULL | Question type |
| order_index | INT | DEFAULT 0 | Display order |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### question_options
Stores answer options for choice-based questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | Unique option identifier (UUID) |
| question_id | VARCHAR(36) | FOREIGN KEY REFERENCES questions(id) ON DELETE CASCADE | Parent question |
| option_text | TEXT | NOT NULL | Option content |
| order_index | INT | DEFAULT 0 | Display order |

#### responses
Stores survey response sessions (anonymous).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | Unique response identifier (UUID) |
| survey_id | VARCHAR(36) | FOREIGN KEY REFERENCES surveys(id) ON DELETE CASCADE | Survey being responded to |
| submitted_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission timestamp |
| session_id | VARCHAR(255) | | Anonymous session identifier |

#### answers
Stores individual question answers within a response.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | Unique answer identifier (UUID) |
| response_id | VARCHAR(36) | FOREIGN KEY REFERENCES responses(id) ON DELETE CASCADE | Parent response |
| question_id | VARCHAR(36) | FOREIGN KEY REFERENCES questions(id) ON DELETE CASCADE | Question being answered |
| answer_text | TEXT | | Text answer content |
| selected_options | JSON | | Array of selected option IDs |

## Indexes

Performance optimization indexes:
- `idx_questions_survey_id` - For filtering questions by survey
- `idx_questions_order` - For ordered question retrieval
- `idx_question_options_question_id` - For filtering options by question
- `idx_question_options_order` - For ordered option retrieval
- `idx_responses_survey_id` - For response analytics
- `idx_responses_submitted_at` - For time-based queries
- `idx_answers_response_id` - For response retrieval
- `idx_answers_question_id` - For question-based analytics

## Sample Data

The database includes 5 fake surveys with various question types:

1. **Customer Satisfaction Survey** (Live)
   - Single choice: Service satisfaction rating
   - Multiple choice: Most used features (max 2)
   - Text: Additional feedback

2. **Employee Engagement Survey** (Live)
   - Single choice: Job satisfaction rating
   - Multiple choice: Work motivations (max 2)
   - Single choice: Recommendation likelihood
   - Text: Improvement suggestions

3. **Product Feedback Survey** (Live)
   - Single choice: Product quality rating
   - Multiple choice: Most valuable features (max 2)
   - Text: Future improvement ideas

4. **Website User Experience Survey** (Draft)
   - Single choice: Website ease of use
   - Multiple choice: Pages visited (max 2)
   - Single choice: Design rating
   - Text: Website improvement suggestions

5. **Event Feedback Survey** (Live)
   - Single choice: Overall event experience
   - Multiple choice: Most valuable sessions (max 2)
   - Single choice: Future attendance likelihood
   - Text: Future event topics

## Setup Instructions

### Prerequisites
- MySQL 8.0 or higher
- MySQL client or phpMyAdmin

### Installation Steps

1. **Create Database**
   ```sql
   mysql -u root -p < schema.sql
   ```

2. **Insert Sample Data**
   ```sql
   mysql -u root -p < seed_data.sql
   ```

3. **Verify Installation**
   ```sql
   USE survey_db;
   SELECT COUNT(*) as survey_count FROM surveys;
   SELECT COUNT(*) as question_count FROM questions;
   SELECT COUNT(*) as option_count FROM question_options;
   ```

### Configuration

Update your backend `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=survey_db
DB_PORT=3306
```

## Backup and Maintenance

### Create Backup
```bash
mysqldump -u root -p survey_db > survey_backup.sql
```

### Restore Backup
```bash
mysql -u root -p survey_db < survey_backup.sql
```

### Performance Monitoring
- Monitor slow queries with MySQL's slow query log
- Use `EXPLAIN` to analyze query performance
- Consider adding additional indexes based on usage patterns

## Security Considerations

- Use environment variables for database credentials
- Implement connection pooling for better performance
- Regular security updates for MySQL
- Consider using SSL connections for production
- Implement proper input validation and sanitization