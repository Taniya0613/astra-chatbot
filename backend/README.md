# Astra Chatbot Backend

Backend API for the Astra Chatbot with authentication functionality.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- MongoDB integration
- CORS enabled for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

The `config.env` file is already configured with your MongoDB URI. Make sure to:

- Change the `JWT_SECRET` to a secure random string in production
- Update the CORS origins in `server.js` for production

### 3. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on port 5000 (or the port specified in config.env).

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": false,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/me`
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer jwt_token_here
```

#### POST `/api/auth/logout`
Logout user (requires authentication)

**Headers:**
```
Authorization: Bearer jwt_token_here
```

### Health Check

#### GET `/api/health`
Check if server is running

## Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  avatar: String (optional),
  isVerified: Boolean (default: false),
  lastLogin: Date (default: now),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with 30-day expiration
- Input validation and sanitization
- CORS protection
- Error handling without exposing sensitive information

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Development

- Uses nodemon for auto-restart during development
- ES6 modules
- MongoDB with Mongoose ODM
- Express.js framework 