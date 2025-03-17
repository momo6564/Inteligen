# Business Directory Portal

A comprehensive platform for business owners to connect, showcase their equipment, and build relationships with other businesses.

## Features

- Business Profile Management
- Equipment/Machinery Listings
- Business Reviews and Ratings
- Availability Status
- Location-based Business Search
- Secure Authentication

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Create a .env file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the development server:
   ```bash
   # Run backend and frontend concurrently
   npm run dev:full
   ```

## Project Structure

```
business-directory-portal/
├── client/                 # React frontend
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── middleware/       # Custom middleware
├── .env                   # Environment variables
└── package.json          # Project dependencies
``` 