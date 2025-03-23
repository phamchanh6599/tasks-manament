# Task Management API

A RESTful API for task management with user authentication built with NestJS and Supabase.

## Features

- 👥 User Authentication & Management:
  - Email/Password Registration with Password Complexity Rules
  - Email Verification Flow
  - JWT Authentication with Refresh Tokens
  - Role-based Access Control (User/Admin)
- 📋 Task Management:
  - Hierarchical Task Structure (Parent-Child Relationships)
  - Task Status Tracking (pending, in_progress, done)
  - Admin-only Task Management
  - User-specific Task Views
- 🔒 Security Features:
  - Rate Limiting (10 requests per minute)
  - Helmet Security Headers
  - CORS Enabled
  - Password Hashing with bcrypt
  - JWT Token Rotation
  - Row Level Security in Supabase
- 📚 API Documentation (Swagger/OpenAPI)

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Supabase account and project
- SMTP server for email sending
- Docker (optional, for containerization)

## Tech Stack

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [PostgreSQL](https://www.postgresql.org/) - Database
- [JWT](https://jwt.io/) - Authentication with refresh tokens
- [Nodemailer](https://nodemailer.com/) - Email sending
- [Handlebars](https://handlebarsjs.com/) - Email templates
- [Swagger](https://swagger.io/) - API documentation
- [Docker](https://www.docker.com/) - Containerization

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tasks-management
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Server Configuration
PORT=3000

# Mail Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
MAIL_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
SMTP_FROM_NAME=Task Management
SMTP_FROM_ADDRESS=noreply@example.com

# Application Configuration
APP_URL=http://localhost:3000
APP_NAME=Task Management App
```

## Database Setup

1. Create a new Supabase project
2. Run the migration file:

```bash
yarn db:migrate
```

To reset the database:

```bash
yarn db:reset
```

## Running the Application

### Development

```bash
yarn start:dev
```

### Production

```bash
# Using Node.js
yarn build
yarn start:prod

# Using Docker
docker build -t task-management-api .
docker run -p 3000:3000 task-management-api
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## API Endpoints

### Authentication & User Management

- `POST /auth/register` - Register a new user
  - Required fields:
    - email (string, valid email format)
    - password (string, must meet complexity requirements)
    - firstName (string)
    - lastName (string)
  - Response: Verification email sent
- `POST /auth/login` - Login user
  - Required fields:
    - email (string)
    - password (string)
  - Returns:
    - access token (15 minutes validity)
    - refresh token (7 days validity)
- `POST /auth/refresh` - Refresh access token
  - Required: Valid refresh token
  - Returns: New access token
- `GET /auth/verify-email` - Verify email address
  - Query params: verification token
- `GET /auth/me` - Get current authenticated user profile
  - Protected route
  - Returns: User profile data

### Tasks

- `POST /tasks` - Create a new task (Admin only)
  - Required fields:
    - title (string)
    - description (string, optional)
    - status (enum: pending, in_progress, done)
    - user_id (UUID, assigned user)
    - parent_id (UUID, optional for subtasks)
- `GET /tasks` - Get all tasks
  - Protected route
  - Returns: Tasks assigned to authenticated user
  - Admin: Can view all tasks
  - User: Can only view assigned tasks
- `GET /tasks/:id` - Get task by ID
  - Protected route
  - Access restricted to assigned user or admin
- `PUT /tasks/:id` - Update task (Admin only)
  - Required fields: Same as POST /tasks
- `DELETE /tasks/:id` - Delete task (Admin only)
- `GET /tasks/:id/subtasks` - Get task's subtasks
  - Protected route
  - Access restricted to assigned user or admin

## Task Model

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done';
  user_id: string;
  parent_id?: string;
  created_at: Date;
  updated_at: Date;
}
```

## Security Features

- Password Complexity Rules:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- JWT Authentication:
  - Access token (15 minutes validity)
  - Refresh token (7 days validity)
  - Token rotation on refresh
- Rate Limiting:
  - Authentication endpoints: 10 requests per minute
  - API endpoints: 100 requests per minute
- Role-based Access Control:
  - Admin: Full access to all endpoints
  - User: Limited to viewing assigned tasks
- Email Verification:
  - Required before first login
  - Secure token-based verification
- Data Security:
  - Password hashing with bcrypt
  - Row Level Security in Supabase
  - CORS protection
  - Helmet security headers

## Project Structure

```
src/
├── auth/           # Authentication module (JWT, Guards, Strategies)
├── users/          # Users module (CRUD operations)
├── tasks/          # Tasks module (Task management with subtasks)
├── mails/          # Email service and Handlebars templates
├── common/         # Shared code (Enums, Decorators)
├── config/         # Configuration (Supabase, Environment)
└── utils/          # Utility functions
```

## Testing

```bash
# Unit tests
yarn test

# e2e tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## Error Handling

The API implements a global error handling strategy with proper HTTP status codes:

- 400: Bad Request (Validation errors)
- 401: Unauthorized (Invalid/expired tokens)
- 403: Forbidden (Insufficient permissions)
- 404: Not Found
- 409: Conflict (Email already exists)
- 429: Too Many Requests (Rate limit exceeded)
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.
