@echo off
echo 🚀 Preparing your React app for Namecheap deployment...

REM Build the project
echo 📦 Building the project...
node_modules\.bin\vite.cmd build

REM Copy .htaccess to dist folder
echo 📋 Copying .htaccess to dist folder...
copy .htaccess dist\

REM Create deployment info file
echo 📄 Creating deployment info...
echo === NAMECHEAP DEPLOYMENT INFO === > dist\DEPLOYMENT_INFO.txt
echo Built on: %date% %time% >> dist\DEPLOYMENT_INFO.txt
echo React App: Luxbed Clone >> dist\DEPLOYMENT_INFO.txt
echo. >> dist\DEPLOYMENT_INFO.txt
echo TO DEPLOY: >> dist\DEPLOYMENT_INFO.txt
echo 1. Upload ALL contents of the 'dist' folder to your Namecheap hosting >> dist\DEPLOYMENT_INFO.txt
echo 2. Make sure to upload the .htaccess file (it's crucial for React Router) >> dist\DEPLOYMENT_INFO.txt
echo 3. Upload to the public_html or your domain's root directory >> dist\DEPLOYMENT_INFO.txt
echo. >> dist\DEPLOYMENT_INFO.txt
echo IMPORTANT: >> dist\DEPLOYMENT_INFO.txt
echo - The .htaccess file handles client-side routing >> dist\DEPLOYMENT_INFO.txt
echo - All assets are in the 'assets' folder >> dist\DEPLOYMENT_INFO.txt
echo - index.html is the main entry point >> dist\DEPLOYMENT_INFO.txt
echo. >> dist\DEPLOYMENT_INFO.txt
echo TROUBLESHOOTING: >> dist\DEPLOYMENT_INFO.txt
echo - If routing doesn't work, ensure .htaccess is uploaded >> dist\DEPLOYMENT_INFO.txt
echo - If styles don't load, check the assets folder >> dist\DEPLOYMENT_INFO.txt
echo - Clear browser cache after deployment >> dist\DEPLOYMENT_INFO.txt
echo. >> dist\DEPLOYMENT_INFO.txt
echo Enjoy your deployed app! 🎉 >> dist\DEPLOYMENT_INFO.txt

echo.
echo ✅ Deployment package ready in 'dist' folder!
echo 📁 Upload the entire 'dist' folder to Namecheap hosting
echo 🌐 Your app will be live after upload!
pause
