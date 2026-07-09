# 🎓 Campus Marketplace

A secure, college-exclusive marketplace that enables students to **buy, sell, and donate** pre-owned items within their campus community. The platform promotes sustainable reuse, reduces waste, and provides a trusted environment by allowing only verified students to participate.


## 📖 About

Every semester, students are left with textbooks, electronics, furniture, lab equipment, and other useful items that often go unused or are discarded. Existing solutions such as WhatsApp groups, Telegram channels, and mass emails are unorganized, difficult to search, and lack trust.

Campus Marketplace addresses this problem by providing a centralized platform where verified students can:

- 🛒 Buy second-hand items
- 💰 Sell unused belongings
- ❤️ Donate items to NGOs
- 🔒 Interact only with verified college users

The project was developed after conducting a survey among over 100 students, which highlighted the demand for a secure and organized campus marketplace.


## ✨ Features

- Secure student authentication
- Email OTP verification
- Password reset via email
- Browse products by category
- Add, edit and delete listings
- Product image support
- Dedicated donation section
- Admin dashboard for platform management
- Responsive and modern UI


## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Context API
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer


## 📂 Project Structure

```
College-MarketPlace-main
├───backend
│   └───src
│       ├───middleware
│       ├───models
│       ├───routes
│       └───utils
└───frontend
    ├───dist
    │   └───assets
    └───src
        ├───components
        ├───contexts
        ├───lib
        └───pages
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Campus-Marketplace.git
cd Campus-Marketplace
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL=your_email
EMAIL_PASSWORD=your_email_password
```

Start the backend:

```bash
npm start
```


### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```


## 🔐 Authentication

The platform uses:

- JWT-based authentication
- Email OTP verification during registration
- Secure password reset via email
- Protected routes for authenticated users


## 🌱 Sustainability Impact

Campus Marketplace promotes a circular economy within college campuses by:

- Reducing unnecessary waste
- Encouraging reuse of functional items
- Helping students save money
- Supporting NGOs through item donations
- Building a trusted campus community


## 🔮 Future Improvements

- In-app chat between buyers and sellers
- Real-time notifications
- Wishlist and bookmarks
- Advanced search and filtering
- Online payment integration
- Mobile application
- Product ratings and reviews

This project was developed as part of the HS202 course at IIT Ropar for educational purposes. 