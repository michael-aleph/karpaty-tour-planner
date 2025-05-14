# 🏞 Karpaty Tour Planner

A web service for planning hiking and tourist routes in the Carpathian region of Ukraine.  
Built as a diploma project using **React**, **Node.js**, and **PostgreSQL**.

---

## 🚀 Features

- 🗺 Browse hiking routes with descriptions, durations, and budgets
- 🔍 Filter routes by:
  - Tags (e.g. mountains, rivers, waterfalls)
  - Duration (in days)
  - Budget range
  - Partial name match (case-insensitive, supports Cyrillic)
- 🌐 Multilingual UI: Ukrainian 🇺🇦 and English 🇬🇧
- 🎯 View detailed route pages with ordered locations
- 🧩 Modern frontend architecture with React + Vite
- ☁️ RESTful API built with Express + PostgreSQL

---

## 🛠 Technologies

- **Frontend**: React, Vite, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Language support**: custom LanguageContext

---

## 📦 Project Structure

```
karpaty-tour-planner/
├── client/             # React frontend (Vite)
└── server/             # Express backend
    ├── controllers/
    ├── routes/
    ├── db/
    ├── validators/
    └── middlewares/
```

---

## 📌 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/karpaty-tour-planner.git
cd karpaty-tour-planner
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Environment variables

Create `.env` file in `/server` with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_DATABASE=karpaty_db
```

Create `.env` file in `/client` with:

```env
VITE_API_URL=http://127.0.0.1:5000
```

### 4. Run the project

```bash
# In /server
npm run dev

# In /client
npm run dev
```

---

## 📸 Screenshots

_(coming soon)_

---

## 🎓 Author

Developed as a diploma project in 2025 by Momotiuk Mykhailo.

---
