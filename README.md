# 🎓 Student Management System — Frontend

A React-based frontend for a full-stack Student Management System.

This application connects to a Spring Boot REST API and provides authentication, role-based access, and student management functionality.

## 🚀 Features

* 🔐 User registration
* 🔑 User login
* 🛡️ JWT authentication
* 👤 User and Admin roles
* 📋 View students
* ➕ Add students
* ✏️ Update students
* 🗑️ Delete students
* 🔎 Search students
* 🔃 Sort students
* 🎯 Filter students
* 📄 View student details
* 🚪 Logout
* 🔒 Protected API requests
* ⚠️ Form validation
* 📡 Spring Boot REST API integration
* 📱 Responsive interface

## 🛠️ Technologies

* React
* JavaScript
* Vite
* HTML5
* CSS3
* React Router
* Fetch API
* JWT
* ESLint

## 📁 Project Structure

```text
studentmanagement-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Requirements

Install the following before running the project:

* Node.js
* npm
* Visual Studio Code
* Spring Boot backend
* MySQL

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/student-management-frontend.git
```

Open the project:

```bash
cd student-management-frontend
```

Install dependencies:

```bash
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080
```

The `.env` file is intentionally ignored by Git.

A sample configuration is provided in:

```text
.env.example
```

## ▶️ Run the Frontend

Start the development server:

```bash
npm run dev
```

Vite normally starts the application at:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite may automatically use another port such as:

```text
http://localhost:5174
```

Use the URL displayed in your Terminal.

## 🔗 Backend

The frontend communicates with the Spring Boot backend.

Default backend URL:

```text
http://localhost:8080
```

The backend URL is configured using:

```env
VITE_API_URL=http://localhost:8080
```

## 🔑 Authentication

The application uses JWT-based authentication.

The authentication flow is:

```text
User
  ↓
Login
  ↓
Spring Boot Authentication API
  ↓
JWT Token
  ↓
Browser localStorage
  ↓
Authorization Header
  ↓
Protected API
```

Authenticated requests use:

```text
Authorization: Bearer <JWT_TOKEN>
```

## 👥 Role-Based Access

### USER

A normal user can:

```text
GET students       ✅
POST student       ❌
PUT student        ❌
DELETE student     ❌
```

### ADMIN

An administrator can:

```text
GET students       ✅
POST student       ✅
PUT student        ✅
DELETE student     ✅
```

The backend Spring Security configuration enforces these permissions.

## 🌐 API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Student Management

```text
GET    /api/students
GET    /api/students/{id}
POST   /api/students
PUT    /api/students/{id}
DELETE /api/students/{id}
```

## 🧪 Running the Complete Application

The backend and frontend run separately.

### Terminal 1 — Backend

```bash
cd ~/Downloads/studentmanagement
./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### Terminal 2 — Frontend

```bash
cd ~/Downloads/studentmanagement-frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

The backend must be running before using the complete application.

## 🔒 Security

The project does not commit private environment variables.

The following file is ignored:

```text
.env
```

The following file is safe to commit:

```text
.env.example
```

Never commit:

```text
.env
```

Do not put database passwords or JWT secrets inside the frontend environment variables.

## 📌 Current Project Status

The frontend includes:

* User registration
* User login
* Admin login
* JWT authentication
* Role-based authorization
* Student CRUD operations
* Student search
* Student filtering
* Student sorting
* Student details
* Protected API requests
* Logout
* Environment variable configuration

## 👨‍💻 Developer

**Solthi Vyshnav**

B.Tech Student
Anurag University

## 📄 License

This project is created for educational and development purposes.
