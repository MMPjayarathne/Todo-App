# To-Do App

A full-stack To-Do application with a **React frontend**, **Spring Boot backend**, and **PostgreSQL database**, all running in **Docker containers**.

## Features

-  Task management (Add, Edit, Delete)
-  Responsive UI using **MUI**
-  RESTful API with **Spring Boot**
-  PostgreSQL as the database
-  **Dockerized setup** for easy deployment

---

## ️ Prerequisites

Ensure you have the following installed:

- [Git](https://git-scm.com/)
- [Docker & Docker Compose](https://www.docker.com/)
- [Node.js & npm](https://nodejs.org/) (Only if running frontend locally)

---

##  Setup Instructions

### 1 Clone the Repository

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

### 2 Build & Run with Docker

```bash
docker-compose up --build -d
```

This will start:

-  **Backend** (Spring Boot) on [**http://localhost:8080**](http://localhost:8080)
-  **Frontend** (React) on [**http://localhost:3000**](http://localhost:3000)
-  **PostgreSQL database** on **localhost:5432**

---

### 3 Run Frontend Locally (Optional)

If you want to develop the frontend separately:

```bash
cd frontend
npm install
npm start
```

---

### 4 API Documentation

Once the backend is running, access API endpoints at:

```bash
http://localhost:8080/api/tasks
```

---

### 5 Stop & Clean Up

```bash
docker-compose down
```

To remove all **Docker containers**, **volumes**, and **networks**:

```bash
docker-compose down -v
```

---

##  Environment Variables

The application uses **default credentials**, which can be configured in `.env` files:

#### Backend (`backend/src/main/resources/application.properties`)

```properties
spring.datasource.url=jdbc:postgresql://db:5432/todo_db  
spring.datasource.username=postgres
spring.datasource.password= YourPassword
frontend.url=http://localhost:3000
```

#### 🔹 Database (`docker-compose.yml`)

```yaml
POSTGRES_USER: postgres
POSTGRES_PASSWORD: YourPassword
POSTGRES_DB: todo_db
```

---

## Troubleshooting

**If Docker build fails**\
Try:

```bash
docker system prune -a
docker-compose up --build -d
```

**Check Logs**

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---


**Thank You!** 

