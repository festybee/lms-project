# LMS Portal — Learning Management System

A full-stack Learning Management System built with Django REST Framework and React.
Students can browse and enroll in courses, teachers can manage course content,
and admins have full control over users and courses.

---

## Live Demo

- Frontend: (add Netlify URL after deployment)
- Backend API: (add Render URL after deployment)

---

## Features

### Student

- Register and log in
- Browse all available courses
- Enroll in courses
- View enrolled courses

### Teacher

- Create, edit, and delete their own courses
- Browse all available courses

### Admin

- Full course management (create, edit, delete any course)
- View and search all registered users

---

## Tech Stack

### Backend

- Python 3
- Django 4
- Django REST Framework
- SQLite (development)
- Token Authentication

### Frontend

- React 18
- React Router DOM v6
- Axios v0.27.2
- Context API for state management

---

## Project Structure

```
lms-project/
├── backend/
│   ├── core/                  # Django project settings and URLs
│   ├── lms/                   # Main app: models, views, serializers
│   │   ├── migrations/
│   │   ├── models.py          # User, Course, Enrollment
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # API views
│   │   ├── urls.py            # API routes
│   │   └── tests.py           # Django integration tests
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/        # Navbar
│       ├── context/           # AuthContext
│       ├── pages/             # Login, Register, Dashboard, Courses, etc.
│       ├── services/          # Axios API service
│       └── App.js             # Routes
├── venv/
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

---

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/lms-project.git
cd lms-project
```

2. Create and activate virtual environment:

```bash
python -m venv venv

# Windows
venv\Scripts\Activate.ps1

# Mac/Linux
source venv/bin/activate
```

3. Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

4. Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create an admin user:

```bash
python manage.py shell
```

```python
from lms.models import User
User.objects.create_superuser(username='admin', password='admin1234', role='admin')
exit()
```

6. Start the server:

```bash
python manage.py runserver
```

API is available at: `http://127.0.0.1:8000/api/`

---

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

App is available at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint              | Access        | Description             |
| ------ | --------------------- | ------------- | ----------------------- |
| POST   | `/api/auth/register/` | Public        | Register a new user     |
| POST   | `/api/auth/login/`    | Public        | Login and receive token |
| POST   | `/api/auth/logout/`   | Authenticated | Logout                  |
| GET    | `/api/courses/`       | Public        | List all courses        |
| POST   | `/api/courses/`       | Teacher/Admin | Create a course         |
| GET    | `/api/courses/:id/`   | Public        | Get course detail       |
| PUT    | `/api/courses/:id/`   | Teacher/Admin | Update a course         |
| DELETE | `/api/courses/:id/`   | Teacher/Admin | Delete a course         |
| POST   | `/api/enroll/`        | Student       | Enroll in a course      |
| GET    | `/api/my-courses/`    | Student       | Get enrolled courses    |
| GET    | `/api/users/`         | Admin         | List all users          |

### Authentication

Protected endpoints require a token in the request header:

```
Authorization: Token <your_token_here>
```

---

## Running Tests

### Django Tests

```bash
cd backend
python manage.py test lms
```

Expected output: 16 tests passing

### React Tests

```bash
cd frontend
npm test -- --watchAll=false
```

Expected output: 20 tests passing

---

## Wireframes

### Login Page

```
+---------------------------+
|        LMS Portal         |
+---------------------------+
|         Login             |
|  Username: [          ]   |
|  Password: [          ]   |
|      [  Login Button  ]   |
|  Don't have an account?   |
|       Register            |
+---------------------------+
```

### Dashboard (Student)

```
+------------------------------------------+
| LMS Portal | Courses | My Courses | Logout|
+------------------------------------------+
|  Welcome back, student1!                 |
|  You are logged in as student            |
|  +----------------+ +-----------------+  |
|  | Browse Courses | | My Courses      |  |
|  +----------------+ +-----------------+  |
+------------------------------------------+
```

### Courses Page

```
+------------------------------------------+
| LMS Portal  |  Courses  |  My Courses    |
+------------------------------------------+
|  Available Courses                       |
|  +----------------+ +----------------+  |
|  | Course Title   | | Course Title   |  |
|  | Description... | | Description... |  |
|  | By teacher1    | | By teacher1    |  |
|  | [Enroll]       | | ✅ Enrolled    |  |
|  +----------------+ +----------------+  |
+------------------------------------------+
```

### Manage Courses (Teacher/Admin)

```
+------------------------------------------+
| LMS Portal  |  Courses  | Manage Courses |
+------------------------------------------+
|  Manage Courses          [+ New Course]  |
|  +--------------------------------------+|
|  | Course Title                         ||
|  | Description...                       ||
|  | By teacher1        [Edit] [Delete]   ||
|  +--------------------------------------+|
+------------------------------------------+
```

---

## Dependencies Notes

- `axios` pinned to v0.27.2 for Create React App/Jest ES module compatibility
- `react-router-dom` v6 used throughout the frontend
- CORS handled via `django-cors-headers` allowing `http://localhost:3000`

---

## Deployment

### Backend — Render

1. Push code to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `gunicorn core.wsgi:application`
6. Add environment variables as needed

### Frontend — Netlify

1. Push code to GitHub
2. Create a new site on [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Set base directory: `frontend`
5. Set build command: `npm run build`
6. Set publish directory: `frontend/build`
7. Update `src/services/api.js` baseURL to point to your Render backend URL

---

## Known Limitations

- SQLite used for development — swap for PostgreSQL in production
- No password reset functionality
- No course content/modules (courses have title and description only per brief)

---

## Author

Festus Imobekhai — [GitHub Profile](https://github.com/festybee)
