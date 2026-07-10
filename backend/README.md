# Campus Marketplace Backend

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Gmail API (OAuth2)

## Features

- User Signup/Login
- JWT Authentication
- Password Reset
- Email Notifications
- Product Management
- Admin Routes

## Environment Variables

Create a `.env` file with:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret

GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_EMAIL=

CLIENT_URL=http://localhost:5173
```

## Run

```bash
npm install
npm start
```