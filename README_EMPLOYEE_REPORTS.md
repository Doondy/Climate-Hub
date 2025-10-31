# Employee Reports Feature - Setup & Usage Guide

## Overview

The Employee Reports page is a professional analytics dashboard that displays employee login history, security metrics, and provides export functionality for compliance and auditing purposes.

## Features

✅ **Real-time Login History**
- View all login attempts with timestamps
- Success/failure status tracking
- IP address and device information

✅ **Statistics Dashboard**
- Total login attempts
- Successful vs failed logins
- Success rate calculation
- Last login information

✅ **Date Filtering**
- View all history
- Filter by last 7 days
- Filter by last 30 days

✅ **Export Functionality**
- Export data to CSV format
- Includes all relevant information
- Timestamped file downloads

✅ **Professional UI**
- Modern, responsive design
- Loading states
- Error handling
- Mobile-friendly

## Prerequisites

1. **MongoDB** - Database must be running and accessible
2. **Backend Server** - Node.js server must be running on port 5000
3. **User Account** - Employee account must be created in the database

## Setup Instructions

### 1. Start the Backend Server

```bash
cd react_project_1
node src/server.js
```

Or if you have a different structure:

```bash
node routes/server.js
```

Make sure the server starts successfully and connects to MongoDB.

### 2. Create an Employee Account

You can create an employee account in two ways:

#### Option A: Using Registration API

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

#### Option B: Direct MongoDB Insert

```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('yourpassword', 10);

// Insert into MongoDB users collection
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  password: hashedPassword,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 3. Access the Employee Reports

1. Start your React development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Select "Employee" as the role
4. Select "Reports" from the action menu
5. Enter your email and password
6. Click "Login"

## How It Works

### Authentication Flow

1. User enters credentials on login page
2. Credentials are sent to `/api/login` endpoint
3. Server validates credentials and returns JWT token
4. Token is stored in localStorage
5. All subsequent API requests include the token in Authorization header

### Data Fetching

The Employee Reports component:
1. Retrieves JWT token from localStorage
2. Makes authenticated request to `/api/login-history`
3. Server validates token and returns user's login history
4. Data is processed and displayed in the dashboard

### Export Feature

When user clicks "Export CSV":
1. Login history data is converted to CSV format
2. CSV file is created using Blob API
3. File is downloaded with timestamp in filename
4. File can be opened in Excel, Google Sheets, etc.

## API Endpoints Used

- `POST /api/login` - Authenticate employee and get JWT token
- `GET /api/login-history` - Get employee's login history (protected route)

## File Structure

```
react_project_1/
├── src/
│   ├── pages/
│   │   └── employee/
│   │       └── EmployeeReports.jsx  # Main component
│   └── styles/
│       └── EmployeeReports.css     # Styling
├── src/
│   └── server.js                   # Backend API server
└── routes/
    └── models/
        ├── User.js                 # User model
        └── LoginHistory.js         # Login history model
```

## Troubleshooting

### "Failed to load reports" Error

**Issue:** Cannot fetch login history

**Solutions:**
1. Verify backend server is running on port 5000
2. Check MongoDB connection
3. Verify token is stored in localStorage
4. Check browser console for detailed error messages

### "Please log in to view reports" Error

**Issue:** No token in localStorage

**Solutions:**
1. Make sure you logged in as an employee
2. Check if token was saved after login
3. Try logging in again

### "Cannot connect to server" Error

**Issue:** Backend server not running

**Solution:**
1. Start the backend server with: `node src/server.js`
2. Verify it's running on the correct port (5000)
3. Check the terminal for any errors

### No Data Showing

**Issue:** No login history records

**Solution:**
1. Login a few times to generate history
2. Check if LoginHistory collection has data in MongoDB
3. Verify the user ID matches between User and LoginHistory collections

## Customization

### Changing Date Ranges

Edit the date filter options in `EmployeeReports.jsx`:

```javascript
const [dateFilter, setDateFilter] = useState("all");
// Add custom options
```

### Adding More Statistics

Add new stat cards in the `stats-grid` section:

```javascript
<div className="stat-card">
  <div className="stat-icon" style={{ background: "#color" }}>
    📊
  </div>
  <div className="stat-content">
    <h3>{yourValue}</h3>
    <p>Your Metric</p>
  </div>
</div>
```

### Styling Changes

Modify `EmployeeReports.css` to customize:
- Color scheme
- Card layouts
- Table appearance
- Responsive breakpoints

## Security Notes

- JWT tokens expire after 1 hour (configured in server.js)
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- All protected routes require valid authentication
- Failed login attempts are logged for security auditing

## Future Enhancements

Potential improvements:
- [ ] Advanced filtering (by IP, device, etc.)
- [ ] Charts and visualizations
- [ ] Email reports
- [ ] Anomaly detection
- [ ] Multi-user management
- [ ] Export to PDF option

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify server logs for API issues
3. Ensure all dependencies are installed
4. Test with a fresh database if needed

---

**Note:** This is a professional-grade reporting system designed for production use. Ensure proper security measures are in place before deploying to a production environment.


