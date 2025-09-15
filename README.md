# Student Feedback Web Application

A full-stack MERN application where students can sign up, log in, submit course feedback, manage their profile, and admins can manage users, courses, and analytics.

---

## Tech Stack
- Frontend: React, React Router, Axios, Tailwind/Bootstrap  
- Backend: Node.js, Express.js, JWT Authentication, bcrypt  
- Database: MongoDB (Atlas or local)  
- File Uploads: Cloudinary (for profile pictures)  
- Deployment:  
  - Frontend → Vercel or Netlify  
  - Backend → Render, Railway, or Heroku  

---

## Features
- **Authentication & Role-Based Access Control (RBAC)**  
  - JWT-based signup/login for Students and Admins  
  - Secure password hashing using bcrypt  

- **Feedback Module**  
  - Students can submit, edit, and delete feedback  
  - Admins can view, filter, and export feedback  

- **Profile Management**  
  - Update personal info, upload profile picture, change password  

- **Admin Dashboard**  
  - View statistics, manage users, block/unblock accounts  
  - Analyze feedback trends  

- **Courses Management (Admin Only)**  
  - Add, Edit, Delete courses selectable during feedback submission  

---

## Steps to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/student-feedback-app.git
cd student-feedback-app
````

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `/frontend` with the following:

```env
REACT_APP_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## Example .env Files

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student-feedback
JWT_SECRET=supersecret123
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=abcd1234xyz
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## Test Login

You can either sign up as a new student via the signup page, or use this preloaded admin account:

* **Admin Login**

  * Email: `admin@example.com`
  * Password: `Admin@123`

If this account is not seeded, you can insert it manually in MongoDB with role set as `"admin"`.

---

## Deployment

### Frontend (Vercel or Netlify)

1. Deploy the frontend folder.
2. Add an environment variable:

   ```env
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```

### Backend (Render, Railway, or Heroku)

1. Deploy the backend folder.
2. Add all `.env` values (`MONGO_URI`, `JWT_SECRET`, Cloudinary keys) in the hosting platform’s environment variables settings.

```

---
Would you like me to also **add a "Project Structure" section** (showing `/backend`, `/frontend`, `/models`, `/routes`, etc.) so your evaluator instantly sees how your repo is organized?
```
