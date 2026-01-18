# Research Session Manager

A management system for research sessions, allowing researchers to create studies, sessions, and time slots that participants can book.

## Features

- **Study management** – Create and manage research projects
- **Session scheduling** – Define study sessions with dates and locations
- **Time slot booking system** – Participants can book suitable time slots
- **User management** – Researcher and admin roles
- **Soft delete** – Safe data removal

## Architecture

```
research-session-manager/
├── backend/          # Fastify REST API
│   ├── prisma/       # Database models and migrations
│   └── src/          # API server code
└── frontend/         # React SPA
    └── src/          # Frontend code
```


## Technologies

### Backend
- **Fastify**
- **Prisma**
- **PostgreSQL**
- **TypeScript**
- **JWT**
- **bcrypt**

### Frontend
- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **React Hook Form + Zod**
- **Axios**

## Data Model

```
User
├── id, email, password, name, role
└── studies[] → Study

Study
├── id, title, description, ownerId
└── sessions[] → Session

Session
├── id, studyId, location, date
└── slots[] → TimeSlot

TimeSlot
├── id, sessionId, startTime, endTime, capacity
└── bookings[] → Booking

Booking
└── id, slotId, name, email, consentAt
```

## Getting Started

### Requirements
- Node.js 18+
- Docker & Docker Compose (for the database)

### 1. Clone the repository
```bash
git clone <repository-url>
cd research-session-manager
```

### 2. Start the database
```bash
cd backend
docker-compose up -d db
```

### 3. Install dependencies and initialize the database
```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npx prisma db seed

# Frontend
cd ../frontend
npm install
```

### 4. Create environment variables
```bash
# backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/research_db"
JWT_SECRET="your-secret-key"
```

### 5. Start development servers
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

Backend runs at `http://localhost:3000`
Frontend runs at `http://localhost:5173`

## Docker Startup

Start the whole application with Docker:
```bash
cd backend
docker-compose up -d
```

## API Endpoints

### Authentication
- `POST /api/auth/register` – Register
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Get current user

### Studies
- `GET /api/studies` – List studies
- `POST /api/studies` – Create study
- `GET /api/studies/:id` – Get study
- `PUT /api/studies/:id` – Update study
- `DELETE /api/studies/:id` – Delete study

### Sessions
- `GET /api/sessions` – List sessions
- `POST /api/sessions` – Create session
- `GET /api/sessions/:id` – Get session

### Time Slots
- `GET /api/timeslots` – List time slots
- `POST /api/timeslots` – Create time slot

### Bookings
- `GET /api/bookings` – List bookings
- `POST /api/bookings` – Create booking