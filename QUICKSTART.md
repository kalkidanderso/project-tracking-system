# Quick Start Guide

## Running the Project

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```
Backend will run on: http://localhost:3000

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

## Testing the API

Create a project:
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "client_name": "Test Client",
    "status": "active",
    "start_date": "2024-01-01",
    "priority": "high"
  }'
```

## Project Structure

```
rudratek/
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── config/    # Database setup
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md          # Full documentation
```

## Key Features

- Clean separation of concerns
- Comprehensive validation
- Status transition rules
- Search and filtering
- Responsive design
- Professional UI

See README.md for complete documentation.
