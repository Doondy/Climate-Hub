# Backend Server Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
```bash
npm run server
```

Or directly:
```bash
node routes/server.js
```

### 3. Verify Server is Running
Visit: http://localhost:5000

You should see:
```json
{
  "message": "🌐 Climate Hub Backend is running!",
  "endpoints": {
    "health": "/health",
    "sms": "/api/sms/send"
  }
}
```

## Health Check
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-01-XX..."
}
```

## SMS Endpoint Test

### Using curl:
```bash
curl -X POST http://localhost:5000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "message": "Test SMS message",
    "alertType": "Severe Weather"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "message": "SMS sent successfully! (Demo Mode - see server console for details)",
  "sid": "demo_1234567890"
}
```

## Troubleshooting

### Error: "Cannot connect to backend server"
1. Make sure the backend server is running
2. Check if port 5000 is available
3. Verify no firewall is blocking the connection

### Error: "Module not found"
Run:
```bash
npm install
```

### MongoDB Connection Issues
MongoDB is optional for SMS functionality. The server will run without it.

## Environment Variables (Optional)

Create a `.env` file in the `react_project_1` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Twilio (for actual SMS sending)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## Running Frontend + Backend Together

### Terminal 1 - Backend:
```bash
npm run server
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

Then visit: http://localhost:5173

## Default Port
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Stop Server
Press `Ctrl + C` in the terminal running the server.

