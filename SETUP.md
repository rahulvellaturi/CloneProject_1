# Facebook Clone - Setup Guide

## Prerequisites

- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Docker** (optional, for database)

## Quick Start

### 1. Database Setup

#### Option A: Using Docker (Recommended)
```bash
docker-compose up -d
```

#### Option B: Manual PostgreSQL Setup
1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE facebook_clone;
```

3. Update `backend/src/main/resources/application.yml` with your database credentials

### 2. Backend Setup

```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

## Environment Variables

### Backend
Create `backend/.env` file (optional, defaults are in application.yml):
```
JWT_SECRET=your-256-bit-secret-key-change-this-in-production-minimum-32-characters
```

### Frontend
Create `frontend/.env` file (optional):
```
REACT_APP_API_URL=http://localhost:8080/api
```

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/search?q={query}` - Search users
- `PUT /api/users/{id}` - Update user

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get news feed
- `GET /api/posts/user/{userId}` - Get user posts
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `POST /api/posts/{id}/like` - Like/unlike post

### Comments
- `POST /api/comments/post/{postId}` - Create comment
- `GET /api/comments/post/{postId}` - Get post comments
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

### Friends
- `POST /api/friends/request/{receiverId}` - Send friend request
- `POST /api/friends/accept/{requestId}` - Accept friend request
- `POST /api/friends/decline/{requestId}` - Decline friend request
- `DELETE /api/friends/{friendId}` - Remove friend
- `GET /api/friends/requests` - Get pending requests

## Features Implemented

✅ User Authentication (JWT)
✅ User Registration & Login
✅ News Feed
✅ Create/Edit/Delete Posts
✅ Comments & Replies
✅ Like/Unlike Posts
✅ User Profiles
✅ Friend Requests
✅ Search Users
✅ Settings Page
✅ Responsive Design

## Features Coming Soon

- Real-time Messaging (WebSocket)
- Stories
- Groups
- Notifications
- Image/Video Upload
- Reactions (Love, Haha, Wow, Sad, Angry)
- Dark Mode

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials in `application.yml`
- Check if port 8080 is available

### Frontend won't start
- Make sure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

### Database connection errors
- Verify PostgreSQL is running
- Check database name and credentials
- Ensure database exists

## Production Deployment

1. Set strong JWT_SECRET
2. Configure CORS properly
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Set up proper logging
6. Configure database connection pooling
7. Add rate limiting
8. Set up monitoring and error tracking
