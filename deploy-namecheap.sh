#!/bin/bash

# Deployment Script for Namecheap Hosting
echo "🚀 Preparing your React app for Namecheap deployment..."

# Build the project
echo "📦 Building the project..."
npm run build

# Copy .htaccess to dist folder
echo "📋 Copying .htaccess to dist folder..."
cp .htaccess dist/

# Create deployment info file
echo "📄 Creating deployment info..."
cat > dist/DEPLOYMENT_INFO.txt << EOF
=== NAMECHEAP DEPLOYMENT INFO ===
Built on: $(date)
React App: Luxbed Clone

TO DEPLOY:
1. Upload ALL contents of the 'dist' folder to your Namecheap hosting
2. Make sure to upload the .htaccess file (it's crucial for React Router)
3. Upload to the public_html or your domain's root directory

IMPORTANT:
- The .htaccess file handles client-side routing
- All assets are in the 'assets' folder
- index.html is the main entry point

TROUBLESHOOTING:
- If routing doesn't work, ensure .htaccess is uploaded
- If styles don't load, check the assets folder
- Clear browser cache after deployment

Enjoy your deployed app! 🎉
EOF

echo "✅ Deployment package ready in 'dist' folder!"
echo "📁 Upload the entire 'dist' folder to Namecheap hosting"
echo "🌐 Your app will be live after upload!"
