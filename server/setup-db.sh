#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 PRISMA DATABASE SETUP - AUTOMATED SETUP${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}\n"

# Step 1: Install npm packages
echo -e "${BLUE}[1/4] Installing npm dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ npm install completed${NC}\n"
else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

# Step 2: Generate Prisma Client
echo -e "${BLUE}[2/4] Generating Prisma Client...${NC}"
npm run prisma:generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generated${NC}\n"
else
    echo -e "${RED}❌ Prisma Client generation failed${NC}"
    exit 1
fi

# Step 3: Run Prisma Migration
echo -e "${BLUE}[3/4] Running Prisma migrations...${NC}"
npm run prisma:migrate -- --skip-generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma migrations completed${NC}\n"
else
    echo -e "${RED}❌ Prisma migrations failed${NC}"
    exit 1
fi

# Step 4: Seed database
echo -e "${BLUE}[4/4] Seeding database...${NC}"
npm run prisma:seed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database seed completed${NC}\n"
else
    echo -e "${RED}❌ Database seed failed${NC}"
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${GREEN}Database Details:${NC}"
echo -e "  📍 Host: 192.168.1.200"
echo -e "  🔌 Port: 3307"
echo -e "  👤 User: root"
echo -e "  🗄️  Database: BTL2\n"

echo -e "${GREEN}Next steps:${NC}"
echo -e "  1. Verify data with: npm run prisma:studio"
echo -e "  2. Start development: npm run start:dev"
echo -e "  3. Read docs: ../Doc/QUICK_START_DB.md\n"
