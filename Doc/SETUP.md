# 🚀 Setup & Installation Guide

Complete step-by-step guide to set up the EduCore E-Learning Dashboard on your machine.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **npm**: v8 or higher (included with Node.js)
- **MySQL Server**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git**: For version control ([Download](https://git-scm.com/))
- **A code editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Verify Installation

```bash
node --version          # Should be v16+
npm --version           # Should be v8+
mysql --version         # Should be v8.0+
git --version           # Any version is fine
```

---

## 📦 Step 1: Clone & Navigate to Project

```bash
# Clone the repository
git clone https://github.com/your-repo/my-elearning-app.git
cd my-elearning-app
```

---

## 🔧 Step 2: Install All Dependencies

Install dependencies for root, client, and server in one command:

```bash
npm run install:all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install --legacy-peer-deps && cd ..
```

**Note**: The `--legacy-peer-deps` flag is used for server because of peer dependency conflicts between NestJS versions. This is safe and required.

---

## 🗄️ Step 3: Database Setup

### Option A: Using DATABASE_SETUP.sql (Recommended)

```bash
# Connect to MySQL
mysql -u root -p

# In MySQL prompt, run:
SOURCE server/DATABASE_SETUP.sql;

# Exit MySQL
EXIT;
```

### Option B: Manual Database Creation

```bash
# Connect to MySQL
mysql -u root -p

# Run these commands in MySQL:
CREATE USER 'sManager'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'sManager'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Create database
mysql -u sManager -p'password123' -e "CREATE DATABASE ElearningDB;"

# Import schema
mysql -u sManager -p'password123' ElearningDB < server/DATABASE_SETUP.sql
```

### Verify Database Setup

```bash
# Connect to the created database
mysql -u sManager -p'password123' ElearningDB

# In MySQL prompt:
SHOW TABLES;      # Should show 10+ tables
SELECT COUNT(*) FROM users;  # Should show some data

# Exit
EXIT;
```

---

## 🔑 Step 4: Environment Configuration

### Create .env File for Server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
# Database Connection
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=sManager
DB_PASSWORD=password123
DB_NAME=ElearningDB

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Create .env File for Client

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
# API Base URL
VITE_API_URL=http://localhost:3001/api
```

---

## ✅ Step 5: Verify Setup

### Check TypeScript Compilation

```bash
# From root directory
npm run build
```

Should complete without errors. You'll see:
```
✓ Client built successfully
✓ Server built successfully
```

### Check Linting

```bash
npm run lint
```

Should show no errors (warnings are acceptable).

---

## 🎉 Installation Complete!

You have successfully set up the project. Next steps:

1. **Read**: `doc/RUNNING.md` to learn how to start the dev server
2. **Read**: `doc/CONFIGURATION.md` for advanced configuration options
3. **Check**: `doc/API.md` to understand available API endpoints

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"

**Solution**: Install Node.js and npm from https://nodejs.org/

### Issue: "MySQL connection refused"

**Solution**: 
```bash
# Check if MySQL is running (Windows)
tasklist | findstr mysql

# Check if MySQL is running (macOS/Linux)
ps aux | grep mysql

# Start MySQL if not running (Windows)
mysql.server start

# Start MySQL if not running (macOS/Linux)
brew services start mysql
```

### Issue: "Access denied for user 'sManager'"

**Solution**:
```bash
# Verify credentials in .env match what you created
# Default: username=sManager, password=password123

# If forgotten, reset:
mysql -u root -p
DROP USER 'sManager'@'localhost';
CREATE USER 'sManager'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'sManager'@'localhost';
FLUSH PRIVILEGES;
```

### Issue: "npm ERR! peer dep missing"

**Solution**: 
```bash
# In server directory, use --legacy-peer-deps
cd server
npm install --legacy-peer-deps
```

### Issue: "Port 3000 or 3001 already in use"

**Solution**: 
```bash
# Find and kill process using port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: "Cannot find module '@nestjs/common'"

**Solution**:
```bash
# Reinstall server dependencies
cd server
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📚 Additional Resources

- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-dev-guides/)
- [npm Documentation](https://docs.npmjs.com/)
- [MySQL Installation Guide](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/)

---

## ✨ Next Steps

1. Start the development server: See `doc/RUNNING.md`
2. Learn about the API: See `doc/API.md`
3. Understand the architecture: See `doc/ARCHITECTURE.md`
4. Set up testing: See `doc/TESTING.md`

---

**Last Updated**: December 2025
**Version**: 1.0
