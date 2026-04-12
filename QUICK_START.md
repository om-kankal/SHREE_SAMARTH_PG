# 🚀 **QUICK START - Copy & Paste Commands**

## **Total Setup Time: ~10-15 minutes**

---

## **ONE-TIME SETUP (Do this once)**

### **Step 1: Setup Database (MySQL)**

```powershell
# Start MySQL service
net start MySQL80

# Login to MySQL (enter your root password when prompted)
mysql -u root -p

# Run these commands in MySQL:
# ---BEGIN---
CREATE DATABASE IF NOT EXISTS sspg;
USE sspg;
SOURCE database.sql;
SHOW TABLES;
EXIT;
# ---END---
```

### **Step 2: Setup Backend**

```powershell
# Navigate to project
cd g:\notes\mca\sem-2\shree_samarth_pg_update3

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r server/requirements.txt
```

### **Step 3: Create .env file**

Create this file: `server\.env`
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=sspg
```

**⚠️ Change `root` to your MySQL root password**

### **Step 4: Setup Frontend**

```powershell
# Make sure you're in: g:\notes\mca\sem-2\shree_samarth_pg_update3

# Install npm packages
npm install
```

---

## **EVERY TIME YOU RUN (3 Terminal Windows)**

### **Terminal 1: Start Backend**
```powershell
cd g:\notes\mca\sem-2\shree_samarth_pg_update3
venv\Scripts\activate
python server/app.py

# Wait for: "Running on http://127.0.0.1:5000"
```

### **Terminal 2: Start Frontend**
```powershell
cd g:\notes\mca\sem-2\shree_samarth_pg_update3
npm run dev

# Wait for: "VITE v8.x.x ready in XXX ms"
# Note the port (usually http://localhost:5173 or 5179)
```

### **Terminal 3: Optional - Test API**
```powershell
# Test backend is responding
Invoke-WebRequest -Uri http://127.0.0.1:5000/api/admin/rooms -Method GET | ConvertTo-Json | Select-Object -First 100

# Test gallery API
Invoke-WebRequest -Uri http://127.0.0.1:5000/api/public/gallery -Method GET | ConvertTo-Json
```

---

## **ACCESS THE APP**

| Page | URL |
|------|-----|
| Home | http://localhost:5173 |
| Admin Login | http://localhost:5173/login |
| Dashboard | http://localhost:5173/admin |
| Gallery Manager | http://localhost:5173/admin?tab=gallery |
| Feedback Manager | http://localhost:5173/admin?tab=feedbacks |
| Public Gallery | http://localhost:5173/gallery |
| Feedback Form | http://localhost:5173/feedback |
| Rooms | http://localhost:5173/rooms |

---

## **ADMIN CREDENTIALS**

```
Username: admin
Password: admin123
```

---

## **STOP EVERYTHING**

```powershell
# In each terminal, press:
Ctrl + C

# Stop MySQL (when done)
net stop MySQL80
```

---

## **TROUBLESHOOT**

### **Port Already in Use?**
Vite auto-selects next port (5174, 5175, etc.). Check the terminal output.

### **Database Connection Error?**
```powershell
# Check if MySQL is running
net start MySQL80

# Test connection
mysql -u root -p -e "SELECT 1;"
```

### **"Module not found" error?**
```powershell
# For Python
pip install -r server/requirements.txt

# For Node
npm install
```

### **Vite Build Error?**
```powershell
# Clear Vite cache
rm -r .vite node_modules/.vite
npm run dev
```

---

## **VERIFY SETUP WORKS**

Checklist before using:
- [ ] MySQL running
- [ ] Backend started (Terminal 1 shows "Running on http://127.0.0.1:5000")
- [ ] Frontend started (Terminal 2 shows "VITE ready")
- [ ] Can access http://localhost:5173
- [ ] Can login with admin/admin123

---

## **FILES TO KNOW**

- `database.sql` - Database schema with gallery & feedbacks tables
- `server/app.py` - Flask main app
- `server/routes.py` - All API endpoints (11 gallery+feedback endpoints)
- `src/pages/Gallery.jsx` - FIXED - was causing Vite error
- `FULL_SETUP_GUIDE.md` - Detailed setup guide
- `FIX_SUMMARY.md` - What was fixed

---

**You're ready to go! 🚀**
