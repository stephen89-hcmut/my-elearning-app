#!/usr/bin/env python3
"""
Automated Prisma Database Setup Script
Khởi tạo database MySQL trên Docker Synology cho e-learning app
"""

import subprocess
import sys
import os
from pathlib import Path

# Colors for output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*70}{Colors.RESET}")
    print(f"{Colors.GREEN}{Colors.BOLD}{text}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*70}{Colors.RESET}\n")

def print_step(step_num, text):
    print(f"{Colors.BLUE}[{step_num}/4]{Colors.RESET} {text}")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}\n")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.RESET}\n")

def run_command(cmd, description):
    """Run a shell command and return success status"""
    try:
        print_step(4, description)
        result = subprocess.run(
            cmd,
            shell=True,
            cwd='/Users/nguyenstephen/Documents/repos/HCMUT/my-elearning-app/server',
            capture_output=True,
            text=True,
            timeout=600
        )
        
        if result.returncode != 0:
            print_error(f"{description} failed")
            if result.stderr:
                print(f"{Colors.RED}{result.stderr[:500]}{Colors.RESET}")
            return False
        
        # Show last part of output
        if result.stdout:
            lines = result.stdout.split('\n')
            relevant_lines = [l for l in lines[-20:] if l.strip()]
            for line in relevant_lines[-5:]:
                print(line)
        
        print_success(description)
        return True
    except subprocess.TimeoutExpired:
        print_error(f"{description} timed out")
        return False
    except Exception as e:
        print_error(f"{description} error: {str(e)}")
        return False

def main():
    os.chdir('/Users/nguyenstephen/Documents/repos/HCMUT/my-elearning-app/server')
    
    print_header("🚀 PRISMA DATABASE SETUP - AUTOMATED INITIALIZATION")
    
    # Check if .env exists
    if not Path('.env').exists():
        print_error(".env file not found!")
        print("Please create .env file first with DATABASE_URL")
        return False
    
    print(f"{Colors.YELLOW}Database Configuration:{Colors.RESET}")
    with open('.env', 'r') as f:
        for line in f:
            if 'DATABASE_URL' in line:
                # Mask password in output
                masked = line.replace('admin@123', '***MASKED***')
                print(f"  {masked.strip()}")
    print()
    
    steps = [
        (1, "npm install", "npm install"),
        (2, "Generating Prisma Client", "npx prisma generate"),
        (3, "Running Prisma migrations", "npx prisma migrate deploy"),
        (4, "Seeding database", "node prisma/seed.ts"),
    ]
    
    for step_num, description, cmd in steps:
        print_step(step_num, description)
        
        if not run_command(cmd, description):
            print_error(f"Setup failed at step {step_num}")
            return False
    
    print_header("🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!")
    
    print(f"{Colors.GREEN}Database Details:{Colors.RESET}")
    print(f"  📍 Host: 192.168.1.200")
    print(f"  🔌 Port: 3307")
    print(f"  👤 User: root")
    print(f"  🗄️  Database: BTL2\n")
    
    print(f"{Colors.GREEN}Next steps:{Colors.RESET}")
    print(f"  1. Verify data: npx prisma studio")
    print(f"  2. Start dev server: npm run start:dev")
    print(f"  3. Read docs: ../Doc/QUICK_START_DB.md\n")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
