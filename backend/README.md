# Backend - Survey Application

Node.js/Express backend with MySQL database integration.

## Architecture

The backend provides a REST API built with:
- **Framework**: Express.js
- **Database**: MySQL with connection pooling
- **ORM**: Raw SQL queries with mysql2
- **Authentication**: None (anonymous surveys)
- **CORS**: Enabled for frontend integration

## API Endpoints

### Surveys
- `GET /api/surveys` - List all surveys
- `GET /api/surveys/:id` - Get survey details
- `GET /api/surveys/:id/full` - Get survey with questions and options
- `POST /api/surveys` - Create new survey
- `PUT /api/surveys/:id` - Update survey
- `PATCH /api/surveys/:id/status` - Update survey status
- `DELETE /api/surveys/:id` - Delete survey
- `GET /api/surveys/:id/questions` - Get survey questions

### Questions
- `POST /api/questions` - Create question with options
- `DELETE /api/questions/:id` - Delete question

### Responses
- `POST /api/responses` - Submit survey response
- `GET /api/responses/survey/:surveyId` - Get survey responses (admin)

### Health Check
- `GET /api/health` - API health status

## Project Structure

```
backend/
├── config/
│   └── database.js      # MySQL connection configuration
├── models/
│   ├── Survey.js        # Survey model with CRUD operations
│   ├── Question.js      # Question model with options
│   └── Response.js      # Response and answer models
├── routes/
│   ├── surveys.js       # Survey-related endpoints
│   ├── questions.js     # Question management endpoints
│   └── responses.js     # Response submission endpoints
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
├── server.js           # Main server file
└── README.md           # This file
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=survey_db
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```

3. **Setup Database**
   ```bash
   # Run the database schema and seed files
   mysql -u root -p < ../database/schema.sql
   mysql -u root -p < ../database/seed_data.sql
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Installation**
   ```bash
   curl http://localhost:3001/api/health
   ```

## Development

### Running the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Testing API Endpoints

#### Get All Surveys
```bash
curl http://localhost:3001/api/surveys
```

#### Get Survey with Questions
```bash
curl http://localhost:3001/api/surveys/f47ac10b-58cc-4372-a567-0e02b2c3d479/full
```

#### Create New Survey
```bash
curl -X POST http://localhost:3001/api/surveys \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Survey","description":"A test survey","status":"draft"}'
```

#### Submit Survey Response
```bash
curl -X POST http://localhost:3001/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "survey_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "answers": [
      {
        "question_id": "q1-f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "selected_options": ["opt1-q1-f47ac10b"]
      }
    ]
  }'
```

## Database Models

### Survey Model
- `findAll()` - Get all surveys
- `findById(id)` - Get survey by ID
- `findByIdWithQuestions(id)` - Get survey with questions
- `create(data)` - Create new survey
- `update(id, data)` - Update survey
- `updateStatus(id, status)` - Update survey status
- `delete(id)` - Delete survey

### Question Model
- `findBySurveyId(surveyId)` - Get questions for survey
- `create(data)` - Create question with options
- `delete(id)` - Delete question

### Response Model
- `create(data)` - Submit survey response
- `findBySurveyId(surveyId)` - Get responses for survey

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **CORS**: Configured to allow frontend requests
- **Input Validation**: Basic validation on required fields
- **SQL Injection Prevention**: Using parameterized queries
- **Anonymous Responses**: No user authentication required

## Performance Considerations

- **Connection Pooling**: MySQL connection pool for better performance
- **Indexes**: Database indexes on frequently queried columns
- **JSON Aggregation**: Efficient loading of questions with options
- **Transaction Support**: For complex operations like response submission

## Deployment

### Production Setup
1. Set `NODE_ENV=production` in environment
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Configure database connection limits
6. Enable MySQL slow query logging

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Monitoring & Logging

- Server startup logs database connection status
- Request/response logging can be added with morgan
- Error logging to console (can be extended to files)
- Health check endpoint for monitoring tools

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env`
   - Kill existing process: `lsof -ti:3001 | xargs kill`

3. **CORS Errors**
   - Verify CORS configuration in server.js
   - Check frontend is making requests to correct port

4. **JSON Parsing Errors**
   - Ensure Content-Type header is set
   - Validate JSON format in requests