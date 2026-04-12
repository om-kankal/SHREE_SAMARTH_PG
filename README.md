# Shree Samarth PG Management System

A complete web application for managing Paying Guest (PG) accommodations with student booking, room management, payment tracking, and admin dashboard.

## Features

### Student Features
- User registration and login
- Room browsing and booking
- Payment tracking
- Inquiry submission

### Admin Features
- Dashboard with analytics
- Room and bed management (max 5 beds per room)
- Booking management with bed assignment
- Payment tracking and updates
- Inquiry management
- SMS notification system

## Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Flask (Python)
- **Database**: MySQL
- **Styling**: CSS with custom design system

## Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL Server
- Git

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd shree_samarth_pg_update3

# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r server/requirements.txt
```

### 2. Database Setup

1. Start MySQL server
2. Create database: `sspg`
3. Update `server/.env` with your MySQL credentials
4. Run the database setup:
```bash
mysql -u root -p sspg < database.sql
```

### 3. Start the Application

#### Option 1: Using the start script (Recommended)
```bash
npm start
```
This will start both frontend and backend servers automatically.

#### Option 2: Manual startup
```bash
# Terminal 1: Start backend
npm run backend

# Terminal 2: Start frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5174
- **Backend API**: http://127.0.0.1:5000

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123


```

## API Endpoints

### Authentication
- `POST /api/register/student` - Student registration
- `POST /api/login/student` - Student login
- `POST /api/login/admin` - Admin login

### Student
- `GET /api/rooms` - Get available rooms
- `POST /api/booking` - Create booking
- `POST /api/inquiries` - Submit inquiry

### Admin
- `GET /api/admin/dashboard` - Dashboard summary
- `GET /api/admin/rooms` - Room management
- `GET /api/admin/bookings` - Booking management
- `GET /api/admin/payments` - Payment management
- `GET /api/admin/inquiries` - Inquiry management

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd server
python app.py        # Start Flask development server
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in `vite.config.js` or `server/app.py`
2. **Database connection failed**: Check MySQL credentials in `server/.env`
3. **Python not found**: Use `py` instead of `python` on Windows
4. **CORS errors**: Ensure both servers are running on correct ports

### Database Issues
- Ensure MySQL is running
- Check database name matches in `.env`
- Run `database.sql` to initialize schema

### Windows-Specific Issues
- If `python` command is not found, the scripts automatically use `py` (Python launcher)
- Make sure Python is installed and added to PATH
- Alternative: Use `py server/app.py` directly to start backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
