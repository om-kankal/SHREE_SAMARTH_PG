# 🚀 **SHREE SAMARTH PG - COMPLETE SETUP GUIDE**

## ✅ **What Has Been Fixed**

1. ✅ **Gallery.jsx Syntax Error** - Fixed unterminated multiline comment
2. ✅ **Database Schema** - Added `gallery` and `feedbacks` tables with sample data
3. ✅ **Backend APIs** - All 11 gallery & feedback endpoints configured
4. ✅ **Frontend Components** - All React components ready

---

# 📋 **STEP-BY-STEP SETUP**

## **STEP 1: Prerequisites Installation**

### Check if you have these installed:

```powershell
# Check Python
python --version
# Expected: Python 3.8+

# Check Node.js
node --version
# Expected: v16+

# Check npm
npm --version
# Expected: npm 7+

# Check MySQL
mysql --version
# Expected: Ver 8.0+
```

**If any are missing:**
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/mysql/

---

## **STEP 2: Database Setup (MySQL)**

### **2.1 Start MySQL Service**

**Windows:**
```powershell
# Open Services and start MySQL Service
# OR via PowerShell
net start MySQL80
```

### **2.2 Create Database and Tables**

```powershell
# Open Command Prompt or PowerShell

# Login to MySQL
mysql -u root -p

# When prompted for password, enter your MySQL root password
# After login, you'll see: mysql>

# Run these commands:
CREATE DATABASE IF NOT EXISTS sspg;
USE sspg;
SOURCE database.sql;

# Verify tables created:
SHOW TABLES;

# You should see these tables:
# admins, students, rooms, beds, bookings, inquiries, payments, sms_notifications, gallery, feedbacks

# Exit MySQL
EXIT;
```

### **2.2 Verify Database Setup**

```powershell
# Check if database created successfully
mysql -u root -p sspg -e "SHOW TABLES; SELECT COUNT(*) as gallery_images FROM gallery; SELECT COUNT(*) as feedbacks FROM feedbacks;"
```

---

## **STEP 3: Backend Setup (Flask/Python)**

### **3.1 Navigate to Project**

```powershell
cd g:\notes\mca\sem-2\shree_samarth_pg_update3
```

### **3.2 Create Virtual Environment** (Recommended)

```powershell
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# You should see (venv) at the start of your terminal
```

### **3.3 Install Python Dependencies**

```powershell
# Install all required packages
pip install -r server/requirements.txt

# Verify installation
pip list
```

### **3.4 Create Environment File**

Create file: `server\.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=sspg
```

**⚠️ Replace `root` with your actual MySQL password**

### **3.5 Test Backend Connection**

```powershell
# Test if imports work
cd server
python -c "from db import get_connection; conn = get_connection(); print('✅ Database connection successful!')"

# Go back to root
cd ..
```

---

## **STEP 4: Frontend Setup (React/Vite)**

### **4.1 Install Dependencies**

```powershell
# Install npm packages
npm install

# Verify React installed
npm list react react-router-dom
```

### **4.2 Verify No Syntax Errors**

```powershell
# This will show any compilation errors
npm run dev
```

If you see: `VITE v8.x.x ... Local: http://localhost:5173`
✅ Frontend is ready!

---

## **STEP 5: Run Everything (3-Terminal Setup)**

### **Terminal 1: Start Backend (Flask)**

```powershell
# Make sure you're in project root
cd g:\notes\mca\sem-2\shree_samarth_pg_update3

# Activate virtual environment
venv\Scripts\activate

# Run Flask server
python server/app.py
```

✅ You'll see:
```
* Running on http://127.0.0.1:5000
* Press CTRL+C to quit
```

### **Terminal 2: Start Frontend (React/Vite)**

```powershell
# New PowerShell window
cd g:\notes\mca\sem-2\shree_samarth_pg_update3

# Run Vite dev server
npm run dev
```

✅ You'll see:
```
VITE v8.x.x ready in xxx ms
Local: http://localhost:5173
```

### **Terminal 3: Test API (Optional)**

```powershell
# Test if backend is responding
Invoke-WebRequest -Uri http://127.0.0.1:5000/api/admin/rooms -Method GET | ConvertTo-Json

# Or test gallery
Invoke-WebRequest -Uri http://127.0.0.1:5000/api/public/gallery -Method GET | ConvertTo-Json
```

---

## **STEP 6: Access the Application**

Open these in your browser:

| Feature | URL |
|---------|-----|
| 🏠 **Home Page** | http://localhost:5173 |
| 🔑 **Student Login** | http://localhost:5173/login |
| 🔑 **Admin Login** | http://localhost:5173/login (Username: admin, Password: admin123) |
| 📊 **Admin Dashboard** | http://localhost:5173/admin |
| 🖼️ **Gallery** | http://localhost:5173/gallery |
| ⭐ **Feedback Form** | http://localhost:5173/feedback |
| 📸 **Gallery Management** | http://localhost:5173/admin?tab=gallery |
| 📝 **Feedback Management** | http://localhost:5173/admin?tab=feedbacks |

---

## **STEP 7: Test Admin Features**

### **7.1 Login to Admin**
- URL: http://localhost:5173/login
- Username: `admin`
- Password: `admin123`

### **7.2 Navigate to Gallery Management**
- Click Admin Dashboard
- Select Gallery from sidebar (🖼️)
- Try uploading an image OR use URL-based images

### **7.3 Test Feedback Management**
- Select Feedbacks from sidebar (⭐)
- View sample feedbacks
- Click eye icon to approve/hide feedback
- Check `/gallery` page to see approved feedback

### **7.4 Test Student Features**
- Browse Rooms on Home page
- Try to book a room
- Submit feedback
- View gallery with lightbox

---

## **🔧 Troubleshooting**

### **Issue: "MySQL connection error"**
```
Solution:
1. Check MySQL is running: net start MySQL80
2. Verify server\.env has correct credentials
3. Test connection: mysql -u root -p
```

### **Issue: "Port 5000 already in use"**
```
Solution:
1. Find process using port 5000:
   netstat -ano | findstr :5000
2. Kill process:
   taskkill /PID <PID> /F
```

### **Issue: "Port 5173 already in use"**
```
Solution:
Vite auto-uses nextport (5174, 5175, etc.)
Check browser console for actual port
```

### **Issue: "npm install fails"**
```
Solution:
1. Delete node_modules and package-lock.json
   rm -r node_modules package-lock.json
2. Clear npm cache
   npm cache clean --force
3. Reinstall
   npm install
```

### **Issue: "Python module not found"**
```
Solution:
1. Check virtual environment is activated (venv) prefix
2. Reinstall requirements:
   pip install --upgrade pip
   pip install -r server/requirements.txt
```

### **Issue: "Vite Transform Error"**
```
Solution:
Comment syntax was incomplete - FIXED in Gallery.jsx
Clear cache:
1. Stop npm run dev (Ctrl+C)
2. Delete .vite folder
3. Run: npm run dev again
```

---

## **✅ Verify Everything Works**

Run this checklist:

- [ ] MySQL service is running
- [ ] Database `sspg` created with all tables
- [ ] `server\.env` file created with credentials
- [ ] `venv` activated in Terminal 1
- [ ] Flask server running on http://127.0.0.1:5000
- [ ] Vite server running on http://localhost:5173
- [ ] Can access admin login page
- [ ] Can login with admin/admin123
- [ ] Can see Gallery tab in admin
- [ ] Can see Feedbacks tab in admin
- [ ] Can browse gallery at /gallery
- [ ] Can submit feedback at /feedback

---

## **📦 Quick Commands Reference**

```powershell
# Activate Virtual Environment
venv\Scripts\activate

# Start Backend
python server/app.py

# Start Frontend
npm run dev

# Stop Services
Ctrl + C

# View Database
mysql -u root -p sspg

# Install Missing Package
pip install <package_name>

# Install Missing npm Package
npm install <package_name>
```

---

## **🎯 Default Credentials**

### **Admin Login**
- Username: `admin`
- Email: `admin@sspg.com`
- Password: `admin123`

### **Test Student**
- Registration No: `S1001`
- Name: `Aman Kumar`
- Email: `aman@example.com`
- Password: `student123`

---

## **📞 API Endpoints Summary**

### **Gallery Endpoints**
- `GET /api/admin/gallery` - Get all gallery images
- `GET /api/public/gallery` - Get visible gallery images
- `POST /api/admin/gallery` - Add image
- `PUT /api/admin/gallery/<id>` - Update image
- `DELETE /api/admin/gallery/<id>` - Delete image

### **Feedback Endpoints**
- `GET /api/admin/feedbacks` - Get all feedbacks (admin)
- `GET /api/public/feedbacks` - Get approved feedbacks
- `POST /api/feedbacks` - Submit feedback (student)
- `POST /api/admin/feedbacks/<id>/toggle-visibility` - Approve/Hide feedback
- `DELETE /api/admin/feedbacks/<id>` - Delete feedback

---

## **🚀 You're All Set!**

Your SSPG PG Management System is now fully functional with:
- ✅ Database with all tables and sample data
- ✅ Backend APIs for all features
- ✅ Frontend React components
- ✅ Admin Dashboard with Gallery & Feedback Management
- ✅ Public Gallery with testimonials
- ✅ Student Feedback submission form

**Next Steps:**
1. Login as admin
2. Upload gallery images
3. Review and approve student feedback
4. Test all features
5. Deploy to production

---

**Need help?** Check the error message in terminal and refer to the Troubleshooting section above.
