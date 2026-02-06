# Facebook Clone - Full Stack Application

A comprehensive Facebook clone built with modern technologies, featuring all major Facebook functionalities.

## Tech Stack

### Frontend
- **React 18** - Latest React with hooks and concurrent features
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **Socket.io-client** - Real-time messaging
- **React Query** - Server state management
- **Framer Motion** - Animations

### Backend
- **Java 17+** - Latest LTS version
- **Spring Boot 3.x** - Application framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database access
- **PostgreSQL** - Database
- **JWT** - Token-based authentication
- **WebSocket** - Real-time communication
- **Spring Boot WebSocket** - WebSocket support

## Features

✅ User Authentication (Register, Login, Logout)
✅ News Feed with posts
✅ Create/Edit/Delete Posts
✅ Comments and Replies
✅ Like/Reaction System
✅ User Profiles
✅ Friends System (Add, Accept, Remove)
✅ Real-time Messenger/Chat
✅ Stories
✅ Groups
✅ Pages
✅ Notifications
✅ Search
✅ Settings
✅ Responsive Design
✅ Dark Mode Support

## Project Structure

```
bfy/
├── frontend/          # React application
├── backend/           # Spring Boot application
├── README.md
└── docker-compose.yml # Database setup
```

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 14+
- Maven 3.8+

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Testing

Run backend tests:
```bash
cd backend
mvn test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## License

MIT License
