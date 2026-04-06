# 🎓 Quiz App (MERN Stack)

A full-stack Quiz Management System built using the **MERN Stack (MongoDB, Express, React, Node.js)** with **role-based access control** for Students, Teachers, and Admin.

---

## 🚀 Features

### 👨‍🎓 Student

* Register & Login
* Attempt quizzes
* Auto-submit on timer
* Limited attempts per quiz
* View best score
* View leaderboard

### 👨‍🏫 Teacher

* Create quizzes (dynamic questions)
* Set max attempts & duration
* View student results
* View leaderboard
* Delete quizzes
* Manage own quizzes

### 👑 Admin

* View platform statistics
* Approve teachers
* Manage users

---

## 🧠 Core Functionalities

* 🔐 Authentication (JWT based)
* 🎭 Role-based Authorization (Student / Teacher / Admin)
* ⏱ Quiz Timer with auto-submit
* 🔁 Attempt limit system
* 🏆 Leaderboard system
* 📊 Dashboard analytics
* 🧾 Result tracking (best attempt logic)

---

## 🏗 Tech Stack

### Frontend

* React (Vite)
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 📁 Project Structure

```
QuizApp/
│
├── client/          # Frontend (React)
│   ├── src/
│   └── ...
│
├── server/          # Backend (Node.js)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone <your-repo-link>
cd QuizApp
```

---

### 2️⃣ Backend Setup

```
cd server
npm install
```

Create `.env` file:

```
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

---

## 🔑 API Endpoints (Important)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `PUT /api/auth/admin/approve/:userId`

### Quiz

* `POST /api/quiz/create`
* `GET /api/quiz`
* `GET /api/quiz/:quizId`
* `POST /api/quiz/start/:quizId`
* `POST /api/quiz/submit/:quizId`
* `DELETE /api/quiz/:quizId`

### Results

* `GET /api/results/leaderboard/:quizId`
* `GET /api/results/student/my-result/:quizId`
* `GET /api/results/teacher/quiz-results/:quizId`

### Dashboard

* `GET /api/dashboard/student`
* `GET /api/dashboard/teacher`
* `GET /api/dashboard/admin`

---

## 🧪 Sample Features Flow

### Student Flow

```
Login → View Quizzes → Start Quiz → Submit → View Score → Leaderboard
```

### Teacher Flow

```
Login → Create Quiz → Students Attempt → View Results → Leaderboard
```

### Admin Flow

```
Login → Approve Teachers → View Platform Stats
```

---

## 🔐 Security Features

* JWT Authentication
* Protected Routes
* Role-based Access Control
* Teacher approval system
* Attempt restriction

---

## 📌 Future Improvements

* ✏️ Edit Quiz Feature
* 📊 Graph Analytics (Charts)
* 🔔 Notifications (Toast)
* 🧑‍💼 User Management (Admin)
* 📱 Responsive UI
* ☁️ Deployment (Render / Vercel)

---

## 👨‍💻 Author

**Muhammad Ayan**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share it!
