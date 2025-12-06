#!/bin/bash

# Fix npm install error - remove @prisma/cli issue

cd /Users/nguyenstephen/Documents/repos/HCMUT/my-elearning-app/server

echo "🔧 Fixing npm install issue..."
echo ""

# Remove lock file
echo "Removing package-lock.json..."
rm -f package-lock.json

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install again
echo ""
echo "Running npm install..."
npm install

echo ""
echo "✅ Done! Try again:"
echo "npm run prisma:generate"
echo "npm run prisma:migrate"
echo "npm run prisma:seed"
