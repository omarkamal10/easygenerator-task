# Auth Frontend

React frontend built with Vite for the authentication application.

## Features

- User registration with validation
- User login with JWT authentication
- Protected routes with React Router
- Form validation with Formik
- Styled with Tailwind CSS

## Quick Start

### Development

```bash
npm install

npm run dev
```

### Production Build

```bash
npm run build

npm run preview
```

## Docker Commands

### Frontend Docker Commands

```bash
docker build -t auth-frontend ./frontend

docker run -p 80:80 --name frontend auth-frontend

docker stop frontend

docker rm frontend
```

### Testing the Frontend in Docker

```bash
docker build -t auth-frontend ./frontend && docker run -p 80:80 --rm auth-frontend

docker run -p 80:80 -e API_URL=http://localhost:5000/api --name frontend auth-frontend
```

## Project Structure

- `src/components` - React components
- `src/context` - Auth context for state management
- `src/services` - API services
- `src/types` - TypeScript type definitions

## API Communication

The frontend communicates with the backend API through:
- Development: Vite's built-in proxy which helps in CORS related concerns and Axios