#!/bin/bash

cd /Users/nguyenstephen/Documents/repos/HCMUT/my-elearning-app/server

echo "🔧 Fixing and installing npm packages..."

# Remove old files
rm -rf node_modules package-lock.json

# Clear cache
npm cache clean --force

# Install
echo ""
echo "Installing npm packages... (wait 3-5 minutes)"
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ npm install completed!"
    echo ""
    echo "Next steps:"
    echo "  npm run prisma:generate"
    echo "  npm run prisma:migrate"
    echo "  npm run prisma:seed"
    echo "  npm run start:dev"
else
    echo ""
    echo "❌ npm install failed"
    exit 1
fi
