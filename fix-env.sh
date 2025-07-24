#!/bin/bash

echo "========================================"
echo "FINDING AND FIXING .env FILE"
echo "========================================"

# Find .env files
echo "Looking for .env files..."
find . -name ".env*" -type f 2>/dev/null

echo ""
echo "Checking current directory for .env:"
if [ -f ".env" ]; then
    echo "Found .env file in current directory"
    echo "Current contents:"
    cat .env
    echo ""
    echo "Backing up .env to .env.backup"
    cp .env .env.backup
    
    echo "Updating .env with EC2 IP..."
    # Replace localhost with EC2 IP
    sed -i 's/localhost:3001/98.130.50.198:3001/g' .env
    sed -i 's/http:\/\/localhost/http:\/\/98.130.50.198/g' .env
    
    echo "Updated .env contents:"
    cat .env
else
    echo "No .env file found in current directory"
fi

echo ""
echo "Checking for .env files in subdirectories..."
find . -name ".env*" -type f -exec echo "Found: {}" \; -exec cat {} \;

echo ""
echo "========================================"
echo "ENV FILE FIX COMPLETE"
echo "========================================"
echo "Now restart your containers:"
echo "docker compose down"
echo "docker compose up -d" 