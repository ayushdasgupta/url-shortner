# URL Shortener Backend

This is the backend API for the URL Shortener application.

## Features

- User authentication with JWT tokens
- URL shortening with optional custom aliases
- URL redirection with click tracking
- Detailed analytics for each shortened URL
- Dashboard with aggregated statistics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Setup

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd url-shortener/server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
5. Edit the `.env` file to configure your environment:
   - Set `MONGO_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Set `BASE_URL` to your application's base URL

## Running the Server

Development mode with auto-restart:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
  - Body: `{ email, password }`

### Link Management
- `POST /api/links` - Create a new short link
  - Body: `{ originalUrl, customAlias (optional), expiresAt (optional) }`
  - Authentication: Required
- `GET /api/links` - Get all links for a user
  - Authentication: Required
- `DELETE /api/links/:id` - Delete a link
  - Authentication: Required

### Link Redirection
- `GET /:shortCode` - Redirect to original URL and log analytics
  - Authentication: Not required

### Analytics
- `GET /api/links/:id/analytics` - Get analytics for a specific link
  - Authentication: Required
- `GET /api/analytics/dashboard` - Get aggregated analytics data
  - Authentication: Required

## Default User Account

For demonstration purposes, a default user is created when the application starts:
- Email: intern@dacoid.com
- Password: Test123

