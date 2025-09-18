#!/bin/bash

# GitHub Upload Script for Timeshare Website
# Run this script after cloning your GitHub repository

echo "🚀 GitHub Upload Script for Timeshare Website"
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run inside your cloned GitHub repository"
    echo "Please run: git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "Then cd into that directory and run this script again"
    exit 1
fi

echo "📁 Copying website files..."
cp -r ../github_ready_website/* .

echo "📝 Adding files to git..."
git add .

echo "💾 Creating commit..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy timeshare website with AI presenter videos"
fi

git commit -m "$commit_msg"

echo "🌐 Pushing to GitHub..."
git push origin main

echo "✅ Upload complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to your GitHub repository settings"
echo "2. Navigate to 'Pages' in the left sidebar"
echo "3. Set source to 'Deploy from a branch'"
echo "4. Select 'main' branch and '/ (root)'"
echo "5. Your site will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/"
echo ""
echo "🎬 Your website with AI presenter videos is now live!"
