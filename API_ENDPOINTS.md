# Climate Hub API Endpoints

## Base URL
```
http://localhost:5000/api
```

---

## 🌍 Weather Absence API

### GET `/weather/absence`
Get all absence requests (admin/company view)
- **Auth**: Required
- **Method**: GET
- **Response**: Array of absence requests

### GET `/weather/absence/me`
Get current user's absence requests
- **Auth**: Required
- **Method**: GET
- **Response**: Array of user's absence requests

### POST `/weather/absence`
Create a new absence request
- **Auth**: Required
- **Method**: POST
- **Body**:
  ```json
  {
    "employeeName": "John Doe",
    "employeeId": "EMP001",
    "location": "New York",
    "description": "Severe weather conditions",
    "verificationResult": {
      "isVerified": true,
      "weatherData": {
        "temperature": 25,
        "condition": "stormy",
        "humidity": 85,
        "windSpeed": 35
      }
    }
  }
  ```

### GET `/weather/absence/:id`
Get a specific absence request
- **Auth**: Required
- **Method**: GET
- **Response**: Single absence request object

### PUT `/weather/absence/:id`
Update absence request (admin approval/rejection)
- **Auth**: Required
- **Method**: PUT
- **Body**:
  ```json
  {
    "status": "approved",  // or "rejected"
    "comment": "Approved due to severe weather"
  }
  ```

### DELETE `/weather/absence/:id`
Delete an absence request
- **Auth**: Required
- **Method**: DELETE
- **Note**: Only owner or admin can delete

---

## 📊 Employee Routes

### GET `/employee/reports`
Get all employee reports
- **Auth**: Required
- **Method**: GET

### GET `/employee/reports/:id`
Get reports for a specific employee
- **Auth**: Required
- **Method**: GET

### POST `/employee/reports`
Create a new employee report
- **Auth**: Required
- **Method**: POST

---

## ✈️ Trip Routes

### GET `/trips`
Get all trips (optionally filtered by userId)
- **Auth**: Optional
- **Method**: GET
- **Query**: `?userId=123`

### GET `/trips/:id`
Get a specific trip
- **Auth**: Optional
- **Method**: GET

### POST `/trips`
Create a new trip plan
- **Auth**: Required
- **Method**: POST

### PUT `/trips/:id`
Update a trip plan
- **Auth**: Required
- **Method**: PUT

### DELETE `/trips/:id`
Delete a trip plan
- **Auth**: Required
- **Method**: DELETE

---

## 🔐 Authentication

### POST `/register`
Register a new user
- **Method**: POST
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "employee"  // or "traveler", "admin"
  }
  ```

### POST `/login`
Login user
- **Method**: POST
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "jwt_token_here",
    "user": { ... }
  }
  ```

---

## 📝 History & Logs

### GET `/history`
Get user history
- **Auth**: Required
- **Method**: GET

### POST `/history`
Add history entry
- **Auth**: Required
- **Method**: POST

### GET `/login-history`
Get login history
- **Auth**: Required
- **Method**: GET

---

## 🧪 Health Check

### GET `/health`
Server health check
- **Method**: GET
- **Response**: `✅ Healthy Server`

### GET `/`
Server status
- **Method**: GET
- **Response**: `🌍 ClimateHub Backend Running`

---

## 🔑 Authentication Header Format

All protected routes require an Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📌 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 💡 Example Usage

### Using fetch (JavaScript)
```javascript
const response = await fetch('http://localhost:5000/api/weather/absence/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Using axios
```javascript
import axios from 'axios';

const response = await axios.get('/api/weather/absence/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```


