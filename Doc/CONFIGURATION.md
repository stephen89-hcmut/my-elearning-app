# ⚙️ Configuration Guide

Comprehensive guide to configuring the EduCore E-Learning Dashboard.

## 📋 Overview

The application requires configuration in three main areas:
1. **Frontend** - Environment and Vite configuration
2. **Backend** - NestJS and database configuration
3. **Database** - MySQL connection settings

---

## 🎨 Frontend Configuration

### Environment Variables

Create `client/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Optional: Debug mode
VITE_DEBUG=false
```

### Vite Configuration

File: `client/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",  // Path alias
    },
  },
  server: {
    port: 3000,    // Frontend port
    proxy: {
      "/api": {
        target: "http://localhost:3001",  // Backend API
        changeOrigin: true,
      },
    },
  },
});
```

### TypeScript Configuration

File: `client/tsconfig.json`

Key settings:
- `target`: ES2020
- `strict`: true (strict type checking)
- `jsx`: react-jsx
- `baseUrl`: . (for path aliases)

### Ant Design Theming

In `client/src/main.tsx`:

```typescript
<ConfigProvider theme={{ 
  token: { 
    colorPrimary: '#1890ff'  // Primary color
  } 
}}>
  {/* App */}
</ConfigProvider>
```

Customize colors:
- `colorPrimary`: Main brand color
- `colorSuccess`: Success state
- `colorWarning`: Warning state
- `colorError`: Error state

---

## 🔧 Backend Configuration

### Environment Variables

Create `server/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=sManager
DB_PASSWORD=password123
DB_NAME=ElearningDB
DATABASE_URL=mysql://sManager:password123@localhost:3306/ElearningDB

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### NestJS Configuration

File: `server/src/app.module.ts`

Key modules:
- `ConfigModule` - Environment variables
- `TypeOrmModule` - Database ORM
- `AuthModule` - Authentication
- `CoursesModule` - Course management
- `UsersModule` - User management
- `ReportsModule` - Reporting

### Database Configuration

TypeORM Setup:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'sManager',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'ElearningDB',
  entities: [/* entities */],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
})
```

### JWT Configuration

In environment:
```env
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=7d
```

---

## 🗄️ Database Configuration

### Connection Details

```
Host:     localhost
Port:     3306
User:     sManager
Password: password123
Database: ElearningDB
```

### MySQL Configuration

File: `server/DATABASE_SETUP.sql`

Contains:
- Database creation
- Table definitions (10+ tables)
- Initial data

### Connection String

```
mysql://sManager:password123@localhost:3306/ElearningDB
```

For production:
```
mysql://username:password@host:port/database_name
```

---

## 🔐 Security Configuration

### Environment Variables Best Practices

1. **Never commit `.env` to Git**
   - Add to `.gitignore` ✓
   
2. **Use `.env.example`** for template:
   ```env
   # Commit this template
   DB_HOST=your-host
   DB_PORT=your-port
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   ```

3. **Generate Strong JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Different configs per environment**:
   ```env
   # Development (.env)
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   
   # Production (.env.production)
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   ```

### CORS Configuration

Only allow trusted origins:

```env
# Single origin
CORS_ORIGIN=http://localhost:3000

# Multiple origins (in backend code)
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

---

## 🚀 Environment-Specific Configurations

### Development Configuration

```env
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
JWT_EXPIRATION=7d
DATABASE_LOGGING=true
```

**Frontend**:
```env
VITE_API_URL=http://localhost:3001/api
VITE_DEBUG=true
```

### Production Configuration

```env
NODE_ENV=production
LOG_LEVEL=error
CORS_ORIGIN=https://yourdomain.com
JWT_EXPIRATION=1d
DATABASE_LOGGING=false
```

**Frontend**:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_DEBUG=false
```

### Testing Configuration

```env
NODE_ENV=test
LOG_LEVEL=error
DATABASE_URL=mysql://test_user:test_pass@localhost:3306/test_db
```

---

## 📝 Configuration Files Reference

### Root Configuration
- `package.json` - Dependencies and scripts
- `.gitignore` - Git exclusions

### Frontend Configuration
- `client/package.json` - Frontend dependencies
- `client/tsconfig.json` - TypeScript settings
- `client/vite.config.ts` - Vite build settings
- `client/.env` - Environment variables
- `client/.eslintrc.cjs` - ESLint rules

### Backend Configuration
- `server/package.json` - Backend dependencies
- `server/tsconfig.json` - TypeScript settings
- `server/nest-cli.json` - NestJS CLI config
- `server/.env` - Environment variables
- `server/DATABASE_SETUP.sql` - Database schema

---

## 🔄 Updating Configuration

### Adding Environment Variables

1. Create in `.env`:
   ```env
   NEW_VARIABLE=value
   ```

2. Access in backend:
   ```typescript
   constructor(private configService: ConfigService) {}
   
   const value = this.configService.get('NEW_VARIABLE');
   ```

3. Access in frontend:
   ```typescript
   const value = import.meta.env.VITE_NEW_VARIABLE;
   ```

### Changing Database

Edit `server/.env`:

```env
# From SQLite to PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database
```

Update `server/src/app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',  // Change this
  // ... rest of config
})
```

### Changing JWT Secret

```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy to .env
JWT_SECRET=your-new-secret-here
```

**Important**: Existing tokens will become invalid.

---

## 🧪 Testing Different Configurations

### Local Development

```bash
# Use default .env
npm run dev
```

### Production Simulation

```bash
# Create .env.production
NODE_ENV=production npm run build
npm run start:server
```

### Database Alternative

```bash
# Test with different database
DATABASE_URL=mysql://alt_user:pass@alt-host/alt_db npm run dev:server
```

---

## 📊 Configuration Checklist

- [ ] Frontend `.env` created and configured
- [ ] Backend `.env` created and configured
- [ ] Database connection verified
- [ ] JWT secret generated and set
- [ ] CORS origin configured
- [ ] API URL correct in frontend
- [ ] Database credentials correct in backend
- [ ] `.env` files added to `.gitignore`
- [ ] `.env.example` created as template
- [ ] All ports available (3000, 3001, 3306)

---

## 🆘 Configuration Troubleshooting

### Issue: "Cannot find variable VITE_API_URL"

**Solution**:
```bash
# Ensure .env file exists and is named correctly
ls -la client/.env

# Restart dev server
npm run dev
```

### Issue: "Database connection timeout"

**Solution**:
1. Check MySQL is running
2. Verify credentials in `.env`
3. Ensure database exists
4. Check firewall/network

### Issue: "CORS error from frontend"

**Solution**:
```env
# Check CORS_ORIGIN matches frontend URL
CORS_ORIGIN=http://localhost:3000
```

### Issue: "JWT token invalid"

**Solution**:
1. Check JWT_SECRET is set correctly
2. Ensure JWT_EXPIRATION is valid
3. Clear browser cookies and login again

---

## 📚 Next Steps

- **Run the Application**: See `doc/RUNNING.md`
- **API Endpoints**: See `doc/API.md`
- **Database Setup**: See `doc/SETUP.md`

---

**Last Updated**: December 2025
**Version**: 1.0
