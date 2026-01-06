# Windows Setup Guide

## Step 1: Install Node.js

1. **Download Node.js**:
   - Visit: https://nodejs.org/
   - Click the **LTS** button (left side, recommended version)
   - File will be named something like `node-v20.x.x-x64.msi`

2. **Run the Installer**:
   - Double-click the downloaded file
   - Click "Next" through all screens
   - **Important**: Check "Automatically install the necessary tools" if asked
   - Click "Install"
   - Wait for installation to complete (2-3 minutes)
   - Click "Finish"

3. **Verify Installation**:
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Type: `node --version`
   - Should show: `v20.x.x` or similar
   - Type: `npm --version`
   - Should show: `10.x.x` or similar

   If you see version numbers, Node.js is installed correctly! ✅

## Step 2: Install Project Dependencies

1. **Open Command Prompt in Project Folder**:
   - Open File Explorer
   - Navigate to: `C:\Users\MohamedGalal\OneDrive - ITC SERVICE LIMITED\Documents\Software\Digital TSS Wheel`
   - Click in the address bar at the top
   - Type `cmd` and press Enter

2. **Run Installation Commands**:

   Copy and paste each command, press Enter, wait for it to complete:

   ```cmd
   npm install
   ```
   *(Takes 2-3 minutes, installs all dependencies)*

   ```cmd
   npm run db:push
   ```
   *(Creates database, takes 5 seconds)*

   ```cmd
   npm run db:seed
   ```
   *(Loads demo data, takes 5 seconds)*

## Step 3: Start the Application

In the same Command Prompt window:

```cmd
npm run dev
```

Wait until you see:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 4: Open in Browser

Open your web browser and visit:

- **Wheel Page**: http://localhost:3000/wheel
- **Admin Dashboard**: http://localhost:3000/admin

**Admin Password**: `your-secret-edit-key-change-this`

## Step 5: Test the Application

1. **Test the Wheel**:
   - Hover over services → tooltip appears
   - Click on a service → modal opens
   - Press ESC or click X → modal closes

2. **Test the Admin**:
   - Go to http://localhost:3000/admin
   - Enter password: `your-secret-edit-key-change-this`
   - Click "Authenticate"
   - Try editing a service name
   - Click "Publish Changes"
   - Refresh the wheel page → see your changes

## Troubleshooting

### "npm is not recognized"

**Solution**: Node.js not installed correctly. Repeat Step 1 and **restart your computer** after installation.

### Port 3000 already in use

**Solution**: Another app is using port 3000. Either:
- Close the other app
- Or run: `set PORT=3001 && npm run dev` to use port 3001 instead

### "Cannot find module"

**Solution**: Dependencies not installed. Run:
```cmd
npm install
```

### Database errors

**Solution**: Recreate database:
```cmd
npm run db:push
npm run db:seed
```

## Quick Start Script

For easier launching in the future, double-click `START.bat` in this folder.

## Stopping the Server

To stop the development server:
- Go to the Command Prompt window
- Press `Ctrl + C`
- Type `Y` and press Enter

## Next Steps

Once everything works locally:
1. Customize your services in `/admin`
2. Export JSON backup
3. Deploy to Vercel (see DEPLOYMENT.md)
4. Embed in WordPress (see WORDPRESS.md)

## Need Help?

- **Installation issues**: Check Node.js is v18 or higher
- **Database issues**: Run `npm run db:push` again
- **Port conflicts**: Use different port with `set PORT=3001 && npm run dev`
- **Other issues**: See README.md troubleshooting section
