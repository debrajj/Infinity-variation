#!/bin/bash

# Infinite Product Options - Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting deployment process..."
echo ""

# Step 1: Build the app
echo "📦 Step 1: Building React app..."
npm run build
echo "✅ Build complete!"
echo ""

# Step 2: Test the build
echo "🧪 Step 2: Testing build..."
if [ ! -d "dist" ]; then
  echo "❌ Error: dist folder not found!"
  exit 1
fi
echo "✅ Build verified!"
echo ""

# Step 3: Deploy based on platform
echo "🌐 Step 3: Choose deployment platform:"
echo "1) Netlify"
echo "2) Vercel"
echo "3) Skip deployment (manual)"
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo "📤 Deploying to Netlify..."
    if command -v netlify &> /dev/null; then
      netlify deploy --prod
      echo "✅ Deployed to Netlify!"
    else
      echo "❌ Netlify CLI not found. Install with: npm install -g netlify-cli"
      exit 1
    fi
    ;;
  2)
    echo "📤 Deploying to Vercel..."
    if command -v vercel &> /dev/null; then
      vercel --prod
      echo "✅ Deployed to Vercel!"
    else
      echo "❌ Vercel CLI not found. Install with: npm install -g vercel"
      exit 1
    fi
    ;;
  3)
    echo "⏭️  Skipping deployment. Upload dist/ folder manually."
    ;;
  *)
    echo "❌ Invalid choice!"
    exit 1
    ;;
esac

echo ""
echo "🎉 Deployment process complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update shopify.app.toml with your deployment URL"
echo "2. Run: shopify app deploy"
echo "3. Install app on your store"
echo "4. Enable theme extension in Theme Customizer"
echo ""
echo "📚 See PRIVATE_APP_DEPLOYMENT.md for detailed instructions"
