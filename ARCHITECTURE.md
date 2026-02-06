# Facebook Clone - Architecture Documentation

## System Architecture

### Overview
This is a full-stack social media application built with:
- **Frontend**: React 18 with Redux Toolkit for state management
- **Backend**: Spring Boot 3.x with RESTful APIs
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Frontend Architecture

### Technology Stack
- **React 18**: Latest React with hooks and concurrent features
- **Redux Toolkit**: State management
- **React Router v6**: Client-side routing
- **Material-UI (MUI)**: Component library
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **Framer Motion**: Animation library
- **React Query**: Server state management

### Project Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── Post.js
│   │   └── CreatePost.js
│   ├── pages/              # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Home.js
│   │   ├── Profile.js
│   │   └── ...
│   ├── store/              # Redux store
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── postSlice.js
│   │       └── userSlice.js
│   ├── utils/              # Utility functions
│   │   ├── api.js
│   │   └── PrivateRoute.js
│   ├── styles/             # CSS files
│   ├── App.js
│   └── index.js
└── package.json
```

### State Management
- **Redux Toolkit**: Centralized state management
  - `authSlice`: Authentication state (user, token, isAuthenticated)
  - `postSlice`: Posts and feed data
  - `userSlice`: User profiles and search results
  - `uiSlice`: UI state (sidebar, notifications, dark mode)

### Component Hierarchy
```
App
├── Router
    ├── Login/Register (Public)
    └── Private Routes
        ├── Header
        ├── Sidebar
        └── Page Content
            ├── Home (Feed)
            ├── Profile
            ├── Messenger
            └── Settings
```

## Backend Architecture

### Technology Stack
- **Spring Boot 3.x**: Application framework
- **Spring Security**: Authentication & authorization
- **Spring Data JPA**: Database access layer
- **PostgreSQL**: Relational database
- **JWT**: Token-based authentication
- **Maven**: Build tool

### Project Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/facebookclone/
│   │   │   ├── model/          # Entity classes
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── service/         # Business logic
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── security/        # Security configuration
│   │   │   └── FacebookCloneApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/                    # Test files
└── pom.xml
```

### Database Schema

#### Core Entities
- **User**: User accounts
- **Post**: User posts
- **Comment**: Post comments
- **Like**: Post likes/reactions
- **FriendRequest**: Friend requests
- **Message**: Direct messages
- **Notification**: User notifications
- **Story**: User stories

#### Relationships
- User ↔ Post (One-to-Many)
- User ↔ Comment (One-to-Many)
- User ↔ Like (One-to-Many)
- Post ↔ Comment (One-to-Many)
- Post ↔ Like (One-to-Many)
- User ↔ User (Many-to-Many for friends)
- User ↔ FriendRequest (Many-to-Many)

### API Design

#### RESTful Principles
- **GET**: Retrieve resources
- **POST**: Create resources
- **PUT**: Update resources
- **DELETE**: Delete resources

#### Endpoint Structure
```
/api/auth/*          - Authentication endpoints
/api/users/*         - User management
/api/posts/*         - Post operations
/api/comments/*      - Comment operations
/api/friends/*       - Friend management
/api/messages/*      - Messaging (future)
/api/notifications/* - Notifications (future)
```

### Security

#### Authentication Flow
1. User registers/logs in
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in Authorization header for subsequent requests
6. Backend validates token on each request

#### Authorization
- Public endpoints: `/api/auth/**`
- Protected endpoints: Require valid JWT token
- User-specific operations: Verify user ownership

## Data Flow

### Creating a Post
1. User types content in CreatePost component
2. Form submission triggers API call
3. Backend validates request and creates Post entity
4. Post saved to database
5. Response returned to frontend
6. Redux store updated with new post
7. UI re-renders with new post

### News Feed
1. Home component mounts
2. Fetches current user data
3. Fetches feed posts (user's posts + friends' posts)
4. Posts displayed in reverse chronological order
5. Pagination for loading more posts

### Friend Request Flow
1. User clicks "Add Friend" on profile
2. Frontend sends POST request to `/api/friends/request/{id}`
3. Backend creates FriendRequest entity
4. Receiver can accept/decline
5. On accept, friendship relationship created
6. Both users added to each other's friends list

## Performance Optimizations

### Frontend
- React.memo for component memoization
- Lazy loading for routes
- Pagination for feed
- Image lazy loading
- Debounced search

### Backend
- JPA lazy loading for relationships
- Database indexing on frequently queried fields
- Pagination for large datasets
- Connection pooling

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT tokens)
- Database replication
- Load balancing
- CDN for static assets

### Caching Strategy
- Redis for session management (future)
- Cache frequently accessed data
- CDN for images/videos

### Database Optimization
- Proper indexing
- Query optimization
- Connection pooling
- Read replicas for read-heavy operations

## Testing Strategy

### Unit Tests
- Service layer logic
- Utility functions
- Redux reducers

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- User workflows
- Critical paths
- Cross-browser testing

## Deployment

### Backend
- Build: `mvn clean package`
- Run: `java -jar target/facebook-clone-backend-1.0.0.jar`
- Environment variables for configuration

### Frontend
- Build: `npm run build`
- Serve static files via Nginx/Apache
- Or deploy to Vercel/Netlify

## Future Enhancements

1. **Real-time Features**
   - WebSocket for messaging
   - Live notifications
   - Online status

2. **Media Handling**
   - Image upload service
   - Video processing
   - Cloud storage integration

3. **Advanced Features**
   - Stories (24-hour posts)
   - Groups and Pages
   - Events
   - Marketplace

4. **Performance**
   - Server-side rendering (Next.js)
   - GraphQL API
   - Microservices architecture

5. **Security**
   - Two-factor authentication
   - Rate limiting
   - Content moderation
   - Data encryption
