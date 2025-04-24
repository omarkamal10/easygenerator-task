# Easy Generator Task

## Features

- User registration with validation
- User login with JWT authentication
- Protected endpoints
- Logging with Winston
- API documentation with Swagger
- Docker containerization
- E2E test

## Running with Docker

### Prerequisites

- Docker and Docker Compose installed

### Start the application

```bash
# Development mode
docker-compose up -d

# Production mode
NODE_ENV=production docker-compose up -d
```

### Access the API

- API Endpoints: http://localhost:3001/api
- API Documentation: http://localhost:3001/api/docs

## Running Tests

```bash
# Run e2e tests
docker-compose run --rm backend sh -c "npm install --only=dev && npm run test:e2e"
```

## API Endpoints

- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Login an existing user
- GET `/api/auth/profile` - Get user profile (protected)