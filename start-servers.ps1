# PowerShell script to start both frontend and backend servers

Write-Host "Starting Climate Hub servers..." -ForegroundColor Green

# Start Frontend Server
Write-Host "`nStarting Frontend Server (Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\Climate Hub\react_project_1'; npm run dev"

# Wait a bit
Start-Sleep -Seconds 2

# Start Backend Server
Write-Host "Starting Backend Server (Express)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\Climate Hub\react_project_1\backend'; node server.js"

Write-Host "`nServers are starting in separate windows." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173 (or 5174 if 5173 is in use)" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:5000" -ForegroundColor Yellow


