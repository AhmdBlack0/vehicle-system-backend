# ⛽ Vehicle Fuel Management System API

A **production-ready REST API** built with **Node.js**, **Express.js**, **PostgreSQL**, **Prisma ORM**, **JWT Authentication**, **bwip-js** barcodes, and clean architecture principles.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT (jsonwebtoken) |
| Barcodes | bwip-js (Code128) |
| Validation | Zod |
| Security | Helmet, Rate Limit, CORS, Compression |
| Password | bcryptjs |
| Logging | Winston + Morgan |
| File Uploads | Multer |

---

## 📁 Project Structure

```
├── server.js                    # App entry point
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.js                  # Database seeder
├── src/
│   ├── config/
│   │   ├── database.js          # Prisma client singleton
│   │   ├── jwt.js               # JWT sign/verify helpers
│   │   └── logger.js            # Winston logger
│   ├── controllers/             # HTTP request handlers
│   ├── services/                # Business logic layer
│   ├── repositories/            # Database access layer
│   ├── middlewares/             # Auth, roles, error handling
│   ├── routes/                  # Express routers
│   ├── validators/              # Zod schemas
│   └── utils/                   # Helpers and utilities
├── uploads/
│   └── barcodes/                # Generated barcode PNGs
└── logs/                        # Winston log files
```

---

## ⚙️ Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- PostgreSQL running locally
- npm or yarn

### 2. Clone & Install
```bash
npm install
```

### 3. Configure Environment
```bash
# Edit .env with your database credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/fuel_management_db"
JWT_SECRET=your_secret_key_min_32_chars
```

### 4. Database Setup
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with initial data
node prisma/seed.js
```

### 5. Start the Server
```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

### 6. One-Command Setup
```bash
npm run setup
```

---

## 🔐 Default Credentials (after seed)

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@123` |
| Worker | `worker1` | `Worker@123` |
| Worker | `worker2` | `Worker@123` |

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

### 🔑 Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login & get JWT token |
| GET | `/auth/me` | Auth | Get current user profile |

### 🚗 Vehicles
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/vehicles` | Auth | List vehicles (search, filter, paginate) |
| POST | `/vehicles` | Admin | Create vehicle (barcode auto-generated) |
| GET | `/vehicles/:id` | Auth | Get vehicle by ID |
| PUT | `/vehicles/:id` | Admin | Update vehicle |
| DELETE | `/vehicles/:id` | Admin | Delete vehicle |
| GET | `/vehicles/:id/barcode` | Auth | Download barcode PNG |
| GET | `/vehicles/barcode/:barcode` | Auth | Lookup vehicle by barcode |

### 👷 Workers
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/workers` | Admin | List all workers |
| POST | `/workers` | Admin | Create worker |
| GET | `/workers/:id` | Admin | Get worker by ID |
| PUT | `/workers/:id` | Admin | Update worker |
| DELETE | `/workers/:id` | Admin | Delete worker |

### ⛽ Fuel Logs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/fuel-logs` | Admin | List all fuel logs |
| POST | `/fuel-logs` | Worker/Admin | Create fuel log entry |
| GET | `/fuel-logs/:id` | Auth | Get fuel log by ID |

### 📊 Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Admin | Summary stats |

### 📈 Reports
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/reports/vehicle/:id` | Admin | Fuel history per vehicle |
| GET | `/reports/worker/:id` | Admin | Fuel history per worker |
| GET | `/reports/daily` | Admin | Daily report (`?date=YYYY-MM-DD`) |
| GET | `/reports/monthly` | Admin | Monthly report (`?year=2024&month=6`) |
| GET | `/reports/range` | Admin | Date range (`?startDate=...&endDate=...`) |

---

## 🔧 Query Parameters

### Vehicles — GET `/vehicles`
```
?search=toyota        Search by vehicle number, plate, type, department
?status=ACTIVE        Filter by status (ACTIVE | INACTIVE)
?department=Ops       Filter by department
?page=1               Page number
?limit=10             Items per page (max 100)
```

### Fuel Logs — GET `/fuel-logs`
```
?vehicleId=1          Filter by vehicle
?workerId=2           Filter by worker
?startDate=2024-01-01 Start date filter
?endDate=2024-01-31   End date filter
?page=1
?limit=10
```

---

## 🌊 Worker Fuel Workflow

```
1. Worker logs in → POST /api/auth/login
2. Worker scans barcode → GET /api/vehicles/barcode/{barcode}
3. Vehicle details returned
4. Worker enters fuel price, quantity, notes → POST /api/fuel-logs
5. System calculates totalPrice = price × quantity
6. Fuel log saved to database
```

---

## 📊 Dashboard Response Example

```json
{
  "success": true,
  "data": {
    "vehicles": { "total": 15, "active": 12, "inactive": 3 },
    "workers": { "total": 8, "activeWorkers": 6 },
    "today": {
      "operations": 5,
      "totalCost": 312.50,
      "totalQuantity": 125.0,
      "date": "2024-06-15"
    },
    "monthly": {
      "operations": 87,
      "totalCost": 4250.75,
      "totalQuantity": 1700.3,
      "month": 6,
      "year": 2024
    }
  }
}
```

---

## 🔒 Security Features

- **JWT Auth** — Stateless authentication with configurable expiry
- **bcryptjs** — Passwords hashed with salt rounds = 12
- **Helmet** — HTTP security headers
- **Rate Limiting** — 100 req/15min globally, 10 req/15min on login
- **CORS** — Configurable allowed origins
- **Compression** — Gzip response compression
- **Input Validation** — Zod schemas on all inputs
- **Error Handling** — Centralized handler with Prisma/Zod/JWT mapping

---

## 📋 Validation Rules

### Password Policy
- Minimum 8 characters
- At least one uppercase letter
- At least one number

### Barcode Format
- Auto-generated: `VH-{YEAR}-{6_CHAR_UUID}`
- Example: `VH-2024-A3F9B2`

---

## 🏗️ Architecture

```
HTTP Request
    ↓
Router (routes/)
    ↓
Middleware (auth, role, validation)
    ↓
Controller (controllers/) — handles HTTP, calls service
    ↓
Service (services/) — business logic, orchestration
    ↓
Repository (repositories/) — database queries via Prisma
    ↓
Database (PostgreSQL via Prisma ORM)
```

---

## 📝 NPM Scripts

| Command | Description |
|---|---|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with nodemon |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:push` | Push schema to DB (no migrations) |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run prisma:seed` | Seed the database |
| `npm run setup` | Full setup: install + push + seed |
