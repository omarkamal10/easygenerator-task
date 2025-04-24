# Auth Application

A full-stack authentication application with React/Vite frontend and NestJS backend.

## Features

- User registration and login
- JWT authentication
- Protected routes
- MongoDB database
- Docker containerization

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Running the Application

1. Clone the repository
2. Start the application:

```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000/api
   - API Documentation: http://localhost:5000/api/docs

### Stopping the Application

```bash
docker-compose down
```

## Docker Commands

### Common Docker Commands

```bash
docker-compose up -d

docker-compose logs

docker-compose logs backend
docker-compose logs frontend

docker-compose down

docker-compose up -d --build

docker-compose down

docker-compose down -v
```

### Individual Container Commands

```bash
docker exec -it easygenerator-backend sh

docker exec -it easygenerator-frontend sh

docker exec -it easygenerator-mongodb mongosh
```

## Project Structure

- `/frontend` - React frontend built with Vite
- `/backend` - NestJS backend with MongoDB

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
npm run start:dev
```

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login a user
- `GET /api/auth/profile` - Get user profile (protected)