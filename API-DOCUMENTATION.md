# Vehicle Fuel Management System - API Documentation

**Base URL:** `https://vehicle-system-six.vercel.app/api`

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Roles
- **ADMIN**: Full access to all endpoints
- **WORKER**: Limited access (can create fuel logs, view own profile)

---

## Endpoints

### 1. Authentication

#### 1.1 Register
**POST** `/auth/register`

Public endpoint - no authentication required. Creates a new worker account with default role `WORKER`.

**Request Body:**
```json
{
  "fullName": "string (2-100 chars, required)",
  "username": "string (3-50 chars, alphanumeric + underscore, required)",
  "password": "string (min 8 chars, 1 uppercase, 1 number, required)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "username": "johndoe",
      "role": "WORKER",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Username already exists",
  "errors": []
}
```

#### 1.2 Login
**POST** `/auth/login`

Public endpoint - no authentication required.

**Request Body:**
```json
{
  "username": "string (3-50 chars)",
  "password": "string (min 6 chars)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "username": "johndoe",
      "role": "ADMIN",
      "active": true
    }
  }
}
```

#### 1.3 Get Profile
**GET** `/auth/me`

Requires authentication.

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "username": "johndoe",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Vehicles

#### 2.1 List Vehicles
**GET** `/vehicles`

Requires authentication (ADMIN or WORKER).

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search in vehicleNumber, plateNumber, vehicleType
- `status` (optional) - Filter by status: `ACTIVE` or `INACTIVE`
- `department` (optional) - Filter by department

**Response (200):**
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": [
    {
      "id": 1,
      "barcode": "VH-2024-A3F9B2",
      "vehicleNumber": "VH-001",
      "plateNumber": "ABC-1234",
      "vehicleType": "Truck",
      "department": "Logistics",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### 2.2 Get Vehicle by Barcode
**GET** `/vehicles/barcode/:barcode`

Requires authentication (ADMIN or WORKER).

**Response (200):**
```json
{
  "success": true,
  "message": "Vehicle found",
  "data": {
    "id": 1,
    "barcode": "VH-2024-A3F9B2",
    "vehicleNumber": "VH-001",
    "plateNumber": "ABC-1234",
    "vehicleType": "Truck",
    "department": "Logistics",
    "status": "ACTIVE"
  }
}
```

#### 2.3 Get Vehicle by ID
**GET** `/vehicles/:id`

Requires authentication (ADMIN or WORKER).

**Response (200):**
```json
{
  "success": true,
  "message": "Vehicle retrieved successfully",
  "data": {
    "id": 1,
    "barcode": "VH-2024-A3F9B2",
    "vehicleNumber": "VH-001",
    "plateNumber": "ABC-1234",
    "vehicleType": "Truck",
    "department": "Logistics",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2.4 Create Vehicle
**POST** `/vehicles`

Requires authentication + ADMIN role.

**Request Body:**
```json
{
  "vehicleNumber": "string (1-50 chars, required)",
  "plateNumber": "string (1-50 chars, required)",
  "vehicleType": "string (1-100 chars, required)",
  "department": "string (1-100 chars, required)",
  "status": "ACTIVE or INACTIVE (optional, default: ACTIVE)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": 1,
    "barcode": "VH-2024-A3F9B2",
    "vehicleNumber": "VH-001",
    "plateNumber": "ABC-1234",
    "vehicleType": "Truck",
    "department": "Logistics",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2.5 Update Vehicle
**PUT** `/vehicles/:id`

Requires authentication + ADMIN role.

**Request Body:**
```json
{
  "vehicleNumber": "string (1-50 chars, optional)",
  "plateNumber": "string (1-50 chars, optional)",
  "vehicleType": "string (1-100 chars, optional)",
  "department": "string (1-100 chars, optional)",
  "status": "ACTIVE or INACTIVE (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": 1,
    "barcode": "VH-2024-A3F9B2",
    "vehicleNumber": "VH-001",
    "plateNumber": "ABC-1234",
    "vehicleType": "Truck",
    "department": "Logistics",
    "status": "ACTIVE",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2.6 Delete Vehicle
**DELETE** `/vehicles/:id`

Requires authentication + ADMIN role.

**Response (200):**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully",
  "data": null
}
```

#### 2.7 Download Barcode
**GET** `/vehicles/:id/barcode`

Requires authentication (ADMIN or WORKER).

**Response:** PNG image file (download as attachment)

#### 2.8 Scan QR Code
**POST** `/vehicles/scan-qr`

Requires authentication (ADMIN or WORKER). Scans a QR code image from Cloudinary URL and returns vehicle information.

**Request Body:**
```json
{
  "imageUrl": "string (Cloudinary image URL, required)"
}
```

**Response (200) - For Workers:**
```json
{
  "success": true,
  "message": "Vehicle connected successfully",
  "data": {
    "barcode": "VH-2024-A3F9B2",
    "vehicleNumber": "VH-001",
    "plateNumber": "ABC-1234"
  }
}
```

**Response (200) - For Admins:**
```json
{
  "success": true,
  "message": "QR code scanned successfully",
  "data": {
    "barcode": "VH-2024-A3F9B2",
    "vehicle": {
      "id": 1,
      "barcode": "VH-2024-A3F9B2",
      "vehicleNumber": "VH-001",
      "plateNumber": "ABC-1234",
      "vehicleType": "Truck",
      "department": "Logistics",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "fuelHistory": {
      "totalOperations": 50,
      "totalQuantity": 2250.00,
      "totalCost": 3375.00,
      "recentLogs": [
        {
          "id": 1,
          "vehicleId": 1,
          "workerId": 1,
          "fuelPrice": 1.50,
          "fuelQuantity": 45.00,
          "totalPrice": 67.50,
          "notes": "Regular fueling",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "vehicle": {
            "id": 1,
            "barcode": "VH-2024-A3F9B2",
            "vehicleNumber": "VH-001",
            "plateNumber": "ABC-1234",
            "vehicleType": "Truck",
            "department": "Logistics",
            "status": "ACTIVE",
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
          },
          "worker": {
            "id": 1,
            "fullName": "John Doe",
            "username": "johndoe",
            "role": "WORKER",
            "active": true,
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
          }
        }
      ]
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No QR code found in image",
  "errors": []
}
```

---

### 3. Workers

#### 3.1 List Workers
**GET** `/workers`

Requires authentication + ADMIN role.

**Response (200):**
```json
{
  "success": true,
  "message": "Workers retrieved successfully",
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "username": "johndoe",
      "role": "WORKER",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3.2 Get Worker by ID
**GET** `/workers/:id`

Requires authentication + ADMIN role.

**Response (200):**
```json
{
  "success": true,
  "message": "Worker retrieved successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "username": "johndoe",
    "role": "WORKER",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3.3 Get Worker History
**GET** `/workers/:id/history`

Requires authentication. Workers can only view their own history, admins can view any worker's history.

**Query Parameters:**
- `startDate` (optional) - Start date (ISO format)
- `endDate` (optional) - End date (ISO format)
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "success": true,
  "message": "Worker fuel history retrieved",
  "data": {
    "worker": {
      "id": 1,
      "fullName": "John Doe",
      "username": "johndoe",
      "role": "WORKER"
    },
    "totalLogs": 30,
    "totalQuantity": 1350.00,
    "totalCost": 2025.00,
    "logs": [
      {
        "id": 1,
        "fuelPrice": 1.50,
        "fuelQuantity": 45.00,
        "totalPrice": 67.50,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "vehicle": {
          "vehicleNumber": "VH-001",
          "plateNumber": "ABC-1234"
        }
      }
    ]
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You can only view your own history",
  "errors": []
}
```

#### 3.5 Create Worker
**POST** `/workers`

Requires authentication + ADMIN role.

**Request Body:**
```json
{
  "fullName": "string (2-100 chars, required)",
  "username": "string (3-50 chars, alphanumeric + underscore, required)",
  "password": "string (min 8 chars, 1 uppercase, 1 number, required)",
  "role": "ADMIN or WORKER (optional, default: WORKER)",
  "active": "boolean (optional, default: true)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Worker created successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "username": "johndoe",
    "role": "WORKER",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3.6 Update Worker
**PUT** `/workers/:id`

Requires authentication + ADMIN role.

**Request Body:**
```json
{
  "fullName": "string (2-100 chars, optional)",
  "username": "string (3-50 chars, alphanumeric + underscore, optional)",
  "password": "string (min 8 chars, 1 uppercase, 1 number, optional)",
  "role": "ADMIN or WORKER (optional)",
  "active": "boolean (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Worker updated successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "username": "johndoe",
    "role": "WORKER",
    "active": true,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3.7 Delete Worker
**DELETE** `/workers/:id`

Requires authentication + ADMIN role.

**Response (200):**
```json
{
  "success": true,
  "message": "Worker deleted successfully",
  "data": null
}
```

---

### 4. Fuel Logs

#### 4.1 List Fuel Logs
**GET** `/fuel-logs`

Requires authentication + ADMIN role.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `vehicleId` (optional) - Filter by vehicle ID
- `workerId` (optional) - Filter by worker ID
- `startDate` (optional) - Filter by start date (ISO format)
- `endDate` (optional) - Filter by end date (ISO format)

**Response (200):**
```json
{
  "success": true,
  "message": "Fuel logs retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicleId": 1,
      "workerId": 1,
      "fuelPrice": 1.50,
      "fuelQuantity": 45.00,
      "totalPrice": 67.50,
      "notes": "Regular fueling",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "vehicle": {
        "id": 1,
        "vehicleNumber": "VH-001",
        "plateNumber": "ABC-1234"
      },
      "worker": {
        "id": 1,
        "fullName": "John Doe",
        "username": "johndoe"
      }
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### 4.2 Get Fuel Log by ID
**GET** `/fuel-logs/:id`

Requires authentication (ADMIN or WORKER).

**Response (200):**
```json
{
  "success": true,
  "message": "Fuel log retrieved successfully",
  "data": {
    "id": 1,
    "vehicleId": 1,
    "workerId": 1,
    "fuelPrice": 1.50,
    "fuelQuantity": 45.00,
    "totalPrice": 67.50,
    "notes": "Regular fueling",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "vehicle": {
      "id": 1,
      "vehicleNumber": "VH-001",
      "plateNumber": "ABC-1234"
    },
    "worker": {
      "id": 1,
      "fullName": "John Doe",
      "username": "johndoe"
    }
  }
}
```

#### 4.3 Create Fuel Log
**POST** `/fuel-logs`

Requires authentication (ADMIN or WORKER).

**Request Body:**
```json
{
  "vehicleId": "number (positive integer, required)",
  "fuelPrice": "number (positive, max 9999.99, required)",
  "fuelQuantity": "number (positive, max 9999.99, required)",
  "notes": "string (max 500 chars, optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Fuel log created successfully",
  "data": {
    "id": 1,
    "vehicleId": 1,
    "workerId": 1,
    "fuelPrice": 1.50,
    "fuelQuantity": 45.00,
    "totalPrice": 67.50,
    "notes": "Regular fueling",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "vehicle": {
      "id": 1,
      "vehicleNumber": "VH-001",
      "plateNumber": "ABC-1234"
    },
    "worker": {
      "id": 1,
      "fullName": "John Doe",
      "username": "johndoe"
    }
  }
}
```

---

### 5. Dashboard

#### 5.1 Get Dashboard Summary
**GET** `/dashboard`

Requires authentication + ADMIN role.

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "vehicles": {
      "total": 50,
      "active": 45,
      "inactive": 5
    },
    "workers": {
      "total": 20,
      "activeWorkers": 18
    },
    "today": {
      "operations": 10,
      "totalCost": 500.00,
      "totalQuantity": 225.00,
      "date": "2024-01-01"
    },
    "monthly": {
      "operations": 300,
      "totalCost": 15000.00,
      "totalQuantity": 6750.00,
      "month": 1,
      "year": 2024
    }
  }
}
```

---

### 6. Reports

#### 6.1 Vehicle Report
**GET** `/reports/vehicle/:id`

Requires authentication + ADMIN role.

**Query Parameters:**
- `startDate` (optional) - Start date (ISO format)
- `endDate` (optional) - End date (ISO format)
- `all` (optional, default: false) - Set to `true` to return all records without pagination
- `page` (optional, default: 1) - Page number (ignored if `all=true`)
- `limit` (optional, default: 20) - Items per page, max: 100 (ignored if `all=true`)

**Response (200):**
```json
{
  "success": true,
  "message": "Vehicle report retrieved successfully",
  "data": {
    "vehicle": {
      "id": 1,
      "barcode": "VH-2024-A3F9B2",
      "vehicleNumber": "VH-001",
      "plateNumber": "ABC-1234",
      "vehicleType": "Truck",
      "department": "Logistics",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "totalLogs": 50,
    "totalQuantity": 2250.00,
    "totalCost": 3375.00,
    "logs": [
      {
        "id": 1,
        "vehicleId": 1,
        "workerId": 1,
        "fuelPrice": 1.50,
        "fuelQuantity": 45.00,
        "totalPrice": 67.50,
        "notes": "Regular fueling",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "vehicle": {
          "id": 1,
          "barcode": "VH-2024-A3F9B2",
          "vehicleNumber": "VH-001",
          "plateNumber": "ABC-1234",
          "vehicleType": "Truck",
          "department": "Logistics",
          "status": "ACTIVE",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "worker": {
          "id": 1,
          "fullName": "John Doe",
          "username": "johndoe",
          "role": "WORKER",
          "active": true,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

#### 6.2 Worker Report
**GET** `/reports/worker/:id`

Requires authentication + ADMIN role.

**Query Parameters:**
- `startDate` (optional) - Start date (ISO format)
- `endDate` (optional) - End date (ISO format)
- `all` (optional, default: false) - Set to `true` to return all records without pagination
- `page` (optional, default: 1) - Page number (ignored if `all=true`)
- `limit` (optional, default: 20) - Items per page, max: 100 (ignored if `all=true`)

**Response (200):**
```json
{
  "success": true,
  "message": "Worker report retrieved successfully",
  "data": {
    "worker": {
      "id": 1,
      "fullName": "John Doe",
      "username": "johndoe",
      "role": "WORKER",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "totalLogs": 30,
    "totalQuantity": 1350.00,
    "totalCost": 2025.00,
    "logs": [
      {
        "id": 1,
        "vehicleId": 1,
        "workerId": 1,
        "fuelPrice": 1.50,
        "fuelQuantity": 45.00,
        "totalPrice": 67.50,
        "notes": "Regular fueling",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "vehicle": {
          "id": 1,
          "barcode": "VH-2024-A3F9B2",
          "vehicleNumber": "VH-001",
          "plateNumber": "ABC-1234",
          "vehicleType": "Truck",
          "department": "Logistics",
          "status": "ACTIVE",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "worker": {
          "id": 1,
          "fullName": "John Doe",
          "username": "johndoe",
          "role": "WORKER",
          "active": true,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

#### 6.3 Daily Report
**GET** `/reports/daily`

Requires authentication + ADMIN role.

**Query Parameters:**
- `date` (optional) - Date in ISO format (default: today)

**Response (200):**
```json
{
  "success": true,
  "message": "Daily report retrieved successfully",
  "data": {
    "date": "2024-01-01",
    "totalLogs": 10,
    "totalQuantity": 450.00,
    "totalCost": 675.00,
    "logs": [
      {
        "id": 1,
        "vehicleId": 1,
        "workerId": 1,
        "fuelPrice": 1.50,
        "fuelQuantity": 45.00,
        "totalPrice": 67.50,
        "notes": "Regular fueling",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "vehicle": {
          "id": 1,
          "barcode": "VH-2024-A3F9B2",
          "vehicleNumber": "VH-001",
          "plateNumber": "ABC-1234",
          "vehicleType": "Truck",
          "department": "Logistics",
          "status": "ACTIVE",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "worker": {
          "id": 1,
          "fullName": "John Doe",
          "username": "johndoe",
          "role": "WORKER",
          "active": true,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

#### 6.4 Monthly Report
**GET** `/reports/monthly`

Requires authentication + ADMIN role.

**Query Parameters:**
- `month` (optional) - Month (1-12, default: current month)
- `year` (optional) - Year (default: current year)

**Response (200):**
```json
{
  "success": true,
  "message": "Monthly report retrieved successfully",
  "data": {
    "month": 1,
    "year": 2024,
    "totalLogs": 300,
    "totalQuantity": 13500.00,
    "totalCost": 20250.00,
    "logs": [
      {
        "id": 1,
        "vehicleId": 1,
        "workerId": 1,
        "fuelPrice": 1.50,
        "fuelQuantity": 45.00,
        "totalPrice": 67.50,
        "notes": "Regular fueling",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "vehicle": {
          "id": 1,
          "barcode": "VH-2024-A3F9B2",
          "vehicleNumber": "VH-001",
          "plateNumber": "ABC-1234",
          "vehicleType": "Truck",
          "department": "Logistics",
          "status": "ACTIVE",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "worker": {
          "id": 1,
          "fullName": "John Doe",
          "username": "johndoe",
          "role": "WORKER",
          "active": true,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

#### 6.5 Date Range Report
**GET** `/reports/range`

Requires authentication + ADMIN role.

**Query Parameters:**
- `startDate` (required) - Start date (ISO format)
- `endDate` (required) - End date (ISO format)
- `all` (optional, default: false) - Set to `true` to return all records without pagination
- `page` (optional, default: 1) - Page number (ignored if `all=true`)
- `limit` (optional, default: 20) - Items per page, max: 100 (ignored if `all=true`)

**Response (200):**
```json
{
  "success": true,
  "message": "Date range report retrieved successfully",
  "data": {
    "dateRange": {
      "from": "2024-01-01",
      "to": "2024-01-31"
    },
    "totalCost": 20250.00,
    "fuelLogs": [
      {
        "id": 1,
        "vehicleId": 1,
        "workerId": 1,
        "fuelPrice": 1.50,
        "fuelQuantity": 45.00,
        "totalPrice": 67.50,
        "notes": "Regular fueling",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "vehicle": {
          "id": 1,
          "barcode": "VH-2024-A3F9B2",
          "vehicleNumber": "VH-001",
          "plateNumber": "ABC-1234",
          "vehicleType": "Truck",
          "department": "Logistics",
          "status": "ACTIVE",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "worker": {
          "id": 1,
          "fullName": "John Doe",
          "username": "johndoe",
          "role": "WORKER",
          "active": true,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      }
    ],
    "total": 300,
    "page": 1,
    "limit": 20,
    "totalPages": 15
  }
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example Usage with JavaScript/Fetch

### Login
```javascript
const login = async (username, password) => {
  const response = await fetch('https://vehicle-system-six.vercel.app/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  return data;
};
```

### Authenticated Request
```javascript
const getVehicles = async (token) => {
  const response = await fetch('https://vehicle-system-six.vercel.app/api/vehicles', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};
```

### Create Fuel Log
```javascript
const createFuelLog = async (token, vehicleId, fuelPrice, fuelQuantity, notes) => {
  const response = await fetch('https://vehicle-system-six.vercel.app/api/fuel-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      vehicleId,
      fuelPrice,
      fuelQuantity,
      notes,
    }),
  });
  const data = await response.json();
  return data;
};
```

---

## Notes

- All dates are in ISO 8601 format (e.g., `2024-01-01T00:00:00.000Z`)
- All monetary values are in decimal format (e.g., `1.50`)
- Barcode is auto-generated when creating a vehicle
- Worker ID is automatically set from the authenticated user when creating fuel logs
- Pagination starts from page 1
