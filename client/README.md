# URL Shortener Frontend

This is the frontend application for the URL Shortener built with React, Tailwind CSS, and Vite.

## Features

- User authentication with JWT
- Create and manage shortened URLs
- Custom URL aliases
- Dashboard with link analytics
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Navigate to the client directory:
   ```
   cd url-shortener/client
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Configure environment variables by creating a .env file:
   ```
   cp .env.example .env
   ```

4. Edit the .env file to set:
   - VITE_API_URL (default: http://localhost:5000)

## Running the Application

### Development mode:
```
npm run dev
```
or
```
yarn dev
```

### Build for production:
```
npm run build
```
or
```
yarn build
```

### Preview production build:
```
npm run preview
```
or
```
yarn preview
```

## Default User Account

For demonstration purposes, you can use the default user account:
- Email: intern@dacoid.com
- Password: Test123
