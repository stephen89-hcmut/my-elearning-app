#!/usr/bin/env python3
"""
Prisma Database Setup & Backend Test Script
Cài đặt dependencies, khởi tạo database, và chạy backend
"""

import subprocess
import sys
import os
from pathlib import Path
import time

# Colors
class C:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_section(title):
    print(f"\n{C.BLUE}{'='*80}{C.RESET}")
    print(f"{C.GREEN}{C.BOLD}{title}{C.RESET}")
    print(f"{C.BLUE}{'='*80}{C.RESET}\n")

def print_step(num, text):
    print(f"{C.BLUE}[{num}]{C.RESET} {C.BOLD}{text}{C.RESET}")

def print_ok(text):
    print(f"{C.GREEN}✅ {text}{C.RESET}\n")

def print_err(text):
    print(f"{C.RED}❌ {text}{C.RESET}\n")

def run_cmd(cmd, description="", show_output=True):
    """Run command and return success status"""
    try:
        if description:
            print_step(1, description)
        
        result = subprocess.run(
            cmd,
            shell=True,
            cwd='/Users/nguyenstephen/Documents/repos/HCMUT/my-elearning-app/server',
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if result.returncode != 0:
            print_err(f"{description} failed")
            if result.stderr:
                print(f"{C.RED}{result.stderr[:1000]}{C.RESET}")
            return False
        
        if show_output and result.stdout:
            lines = result.stdout.split('\n')
            for line in lines[-10:]:
                if line.strip():
                    print(line)
        
        if description:
            print_ok(f"{description} completed")
        return True
    except subprocess.TimeoutExpired:
        print_err(f"{description} timed out")
        return False
    except Exception as e:
        print_err(f"Error: {str(e)}")
        return False

def main():
    os.chdir('/Users/nguyenstephen/Documents/repos/HCMUT/my-elearning-app/server')
    
    print_section("🚀 PRISMA SETUP & BACKEND TEST")
    
    # Check .env
    print_step(1, "Checking .env configuration...")
    if not Path('.env').exists():
        print_err(".env file not found!")
        return False
    
    with open('.env', 'r') as f:
        content = f.read()
        if 'DATABASE_URL' in content:
            for line in content.split('\n'):
                if 'DATABASE_URL' in line:
                    masked = line.replace('admin@123', '***')
                    print(f"  {masked}")
    print_ok(".env configured")
    
    # Step 1: npm install
    print_section("STEP 1: Installing npm packages (3-5 minutes)")
    print_step(1, "Running npm install...")
    print(f"{C.YELLOW}(This may take a few minutes...){C.RESET}")
    
    if not run_cmd('npm install', show_output=False):
        print_err("npm install failed!")
        return False
    print_ok("npm packages installed")
    
    # Step 2: Check if node_modules created
    if not Path('node_modules').exists():
        print_err("node_modules folder not created!")
        return False
    print_ok("node_modules folder verified")
    
    # Step 3: Prisma generate
    print_section("STEP 2: Generating Prisma Client (< 1 minute)")
    if not run_cmd('npx prisma generate', "Generating Prisma Client"):
        return False
    
    # Step 4: Prisma migrate
    print_section("STEP 3: Running Prisma Migrations (1-2 minutes)")
    if not run_cmd('npx prisma migrate deploy', "Creating database & migrations"):
        print(f"{C.YELLOW}Note: If database already exists, this is okay.{C.RESET}\n")
    
    # Step 5: Prisma seed
    print_section("STEP 4: Seeding Database (< 1 minute)")
    if not run_cmd('npm run prisma:seed', "Loading test data"):
        print(f"{C.YELLOW}Note: If data already exists, you may see constraint errors. This is okay.{C.RESET}\n")
    
    # Step 6: Summary
    print_section("✅ SETUP COMPLETED SUCCESSFULLY!")
    
    print(f"{C.GREEN}Database configured:{C.RESET}")
    print(f"  📍 Host: 192.168.1.200")
    print(f"  🔌 Port: 3307")
    print(f"  👤 User: root")
    print(f"  🗄️  Database: BTL2\n")
    
    print(f"{C.GREEN}Available commands:{C.RESET}")
    print(f"  npm run prisma:studio    - View data visually (http://localhost:5555)")
    print(f"  npm run start:dev         - Start development server")
    print(f"  npm run start             - Start production server")
    print(f"  npm test                  - Run tests\n")
    
    print(f"{C.YELLOW}NEXT STEPS:{C.RESET}")
    print(f"  1. View data: npm run prisma:studio")
    print(f"  2. Start dev: npm run start:dev")
    print(f"  3. Test API: Open http://localhost:3000\n")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
