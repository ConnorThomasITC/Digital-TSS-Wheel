# Installation & Testing Guide

Step-by-step guide to get TSS Wheel running locally and verify all features work.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control (optional but recommended)

Check your versions:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

If you need to install/update Node.js:
- Download from: https://nodejs.org/
- Choose LTS (Long Term Support) version

## Installation Steps

### Step 1: Navigate to Project Directory

Open terminal/command prompt and navigate to the project:

```bash
cd "c:\Users\MohamedGalal\OneDrive - ITC SERVICE LIMITED\Documents\Software\Digital TSS Wheel"
```

Or if you're opening a new terminal, use the path where you have the project.

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages. It may take 2-3 minutes.

**Expected output**: No errors, should end with "added XXX packages"

### Step 3: Verify Environment Variables

Check that `.env.local` exists and contains:

```env
DATABASE_PATH=./data/tss-wheel.db
EDIT_KEY=your-secret-edit-key-change-this
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Initialize Database

```bash
npm run db:push
```

**Expected output**: "Database initialized successfully at: ./data/tss-wheel.db"

This creates:
- `data/` directory
- `tss-wheel.db` file (empty database)

### Step 5: Load Demo Data

```bash
npm run db:seed
```

**Expected output**: "Database seeded successfully with 7 services"

This adds the demo services:
- Cyber Security
- M365
- Support Level
- Servers & Cloud
- Business Continuity
- People & Communications
- Building Services

### Step 6: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

**Important**: Leave this terminal window open. The server must keep running.

## Testing Checklist

Open your browser and test each feature:

### Test 1: Wheel Page ✓

1. Visit: http://localhost:3000/wheel
2. Verify:
   - [ ] Wheel displays with 7 colored segments
   - [ ] Each segment shows a service name
   - [ ] "TSS Services" text in center

### Test 2: Tooltips ✓

1. On wheel page, hover over each service
2. Verify:
   - [ ] Tooltip appears near cursor
   - [ ] Shows service description
   - [ ] Tooltip stays within screen bounds
   - [ ] Tooltip disappears when you move away

### Test 3: Service Modals ✓

1. Click "Cyber Security" segment
2. Verify:
   - [ ] Modal opens with animation
   - [ ] Shows "Cyber Security" title in color
   - [ ] Shows full description text
   - [ ] Shows donut chart with subservices
   - [ ] Shows percentages next to each subservice

3. Test closing:
   - [ ] Click X button → modal closes
   - [ ] Click outside modal → modal closes
   - [ ] Press ESC key → modal closes

4. Click each service and verify modals open

### Test 4: Mobile Behavior ✓

1. Open browser dev tools (F12)
2. Click device toolbar icon (mobile view)
3. Select iPhone or Android device
4. On wheel page:
   - [ ] Wheel is responsive (fits screen)
   - [ ] Tap service once → tooltip shows
   - [ ] Tap same service again → modal opens
   - [ ] Modal is scrollable on small screens

### Test 5: Admin Access ✓

1. Visit: http://localhost:3000/admin
2. Verify:
   - [ ] Shows login screen
   - [ ] "Admin Access" heading visible

3. Enter edit key: `your-secret-edit-key-change-this`
4. Click "Authenticate"
5. Verify:
   - [ ] Dashboard loads
   - [ ] Shows "TSS Wheel Dashboard" header
   - [ ] Lists all 7 services

### Test 6: Edit Service ✓

1. On admin page, find "Cyber Security"
2. Click "Expand"
3. Change name to "Security Services"
4. Change tooltip to "Comprehensive security"
5. Click "Publish Changes"
6. Verify:
   - [ ] Green success message appears
   - [ ] Message says "Changes published successfully"

7. Visit: http://localhost:3000/wheel
8. Verify:
   - [ ] Service now shows "Security Services"
   - [ ] Tooltip shows "Comprehensive security"

9. Return to admin, change back to original values

### Test 7: Add New Service ✓

1. On admin page, click "+ Add Service"
2. Verify:
   - [ ] New service appears at bottom
   - [ ] Shows "New Service" name
   - [ ] Is automatically expanded

3. Fill in:
   - Name: "Testing Service"
   - Tooltip: "This is a test"
   - Description: "Full test description"
   - Color: #00FF00 (bright green)

4. Click "Publish Changes"
5. Visit wheel page
6. Verify:
   - [ ] New green segment appears
   - [ ] Shows "Testing Service" label
   - [ ] Click opens modal with description

### Test 8: Delete Service ✓

1. On admin page, find "Testing Service"
2. Click "Delete"
3. Click "OK" in confirmation dialog
4. Click "Publish Changes"
5. Visit wheel page
6. Verify:
   - [ ] "Testing Service" is gone
   - [ ] Wheel has 7 segments again

### Test 9: Add Subservice ✓

1. On admin page, expand "Cyber Security"
2. Scroll to "Subservices" section
3. Click "+ Add"
4. Click "Edit" on new subservice
5. Fill in:
   - Name: "Test Sub"
   - Tooltip: "Test tooltip"
   - Weight: 15
   - Color: #FF0000 (red)

6. Click "Publish Changes"
7. Visit wheel, click "Cyber Security"
8. Verify:
   - [ ] Modal shows "Test Sub" in chart
   - [ ] Shows percentage based on weight
   - [ ] Red color in chart

### Test 10: Color Picker ✓

1. On admin page, expand any service
2. Click the color box next to hex input
3. Verify:
   - [ ] Color picker popup appears
   - [ ] Can drag to select color
   - [ ] Hex value updates
   - [ ] Can type hex directly

4. Close picker by clicking outside
5. Verify:
   - [ ] Picker closes
   - [ ] Color is saved

### Test 11: Reorder Services ✓

1. On admin page, find first service
2. Click ▼ down arrow
3. Verify:
   - [ ] Service moves down one position

4. Click ▲ up arrow
5. Verify:
   - [ ] Service moves back up

6. Click "Publish Changes"
7. Visit wheel page
8. Verify:
   - [ ] Services appear in new order (clockwise from top)

### Test 12: Live Preview ✓

1. On admin page, click "Show Preview"
2. Verify:
   - [ ] Preview panel appears on right (desktop)
   - [ ] Shows live wheel

3. Edit a service name
4. Verify:
   - [ ] Preview updates immediately
   - [ ] Wheel page doesn't update yet (not published)

5. Click "Hide Preview"
6. Verify:
   - [ ] Preview panel disappears

### Test 13: Export JSON ✓

1. On admin page, click "Export JSON"
2. Verify:
   - [ ] File downloads
   - [ ] Filename is `tss-wheel-backup-[timestamp].json`
   - [ ] File contains JSON data

3. Open file in text editor
4. Verify:
   - [ ] Valid JSON format
   - [ ] Contains "services" array
   - [ ] Each service has "subservices" array

### Test 14: Import JSON ✓

1. Make a small change (e.g., rename a service)
2. Click "Publish Changes"
3. Click "Import JSON"
4. Select the exported file from Test 13
5. Verify:
   - [ ] Green success message
   - [ ] Services revert to exported state

6. Click "Publish Changes"
7. Visit wheel page
8. Verify:
   - [ ] Shows original data (change is undone)

### Test 15: Logout ✓

1. On admin page, click "Logout"
2. Verify:
   - [ ] Returns to login screen
   - [ ] Can't see dashboard

3. Refresh page (F5)
4. Verify:
   - [ ] Still shows login screen
   - [ ] localStorage cleared

### Test 16: Keyboard Navigation ✓

1. Visit wheel page
2. Press Tab key repeatedly
3. Verify:
   - [ ] Focus moves to each service segment
   - [ ] Focus visible (outline or highlight)

4. Press Enter on focused service
5. Verify:
   - [ ] Modal opens

6. Press Tab in modal
7. Verify:
   - [ ] Focus moves to X button
   - [ ] Focus trapped in modal

8. Press ESC
9. Verify:
   - [ ] Modal closes

### Test 17: API Endpoints ✓

Test using browser or curl:

**Public endpoint**:
```bash
curl http://localhost:3000/api/config
```
Verify: Returns JSON with services

**Protected endpoint** (wrong key):
```bash
curl http://localhost:3000/api/export?key=wrong
```
Verify: Returns `{"error":"Unauthorized"}` with 401 status

**Protected endpoint** (correct key):
```bash
curl http://localhost:3000/api/export?key=your-secret-edit-key-change-this
```
Verify: Returns full JSON export

### Test 18: Embed Script ✓

1. Create test HTML file: `test-embed.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TSS Wheel Embed Test</title>
</head>
<body>
  <h1>Embed Test</h1>
  <div id="tss-wheel"></div>
  <script src="http://localhost:3000/embed.js" async></script>
</body>
</html>
```

2. Open file in browser (double-click or drag to browser)
3. Verify:
   - [ ] Wheel loads in the page
   - [ ] Iframe is created inside `#tss-wheel`
   - [ ] Wheel is interactive

### Test 19: Iframe Embed ✓

1. Create test HTML file: `test-iframe.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TSS Wheel Iframe Test</title>
</head>
<body>
  <h1>Iframe Test</h1>
  <iframe
    src="http://localhost:3000/wheel"
    width="100%"
    height="600"
    frameborder="0"
    title="TSS Wheel"
  ></iframe>
</body>
</html>
```

2. Open file in browser
3. Verify:
   - [ ] Wheel displays in iframe
   - [ ] Fully interactive
   - [ ] Modals work

### Test 20: Error Handling ✓

1. On admin, try to delete all services
2. Verify:
   - [ ] Confirmation dialog appears for each

3. Click "Publish Changes" with empty config
4. Verify:
   - [ ] Either succeeds (empty wheel) or shows error
   - [ ] No crash

5. Import invalid JSON file
6. Verify:
   - [ ] Shows error message
   - [ ] Dashboard doesn't crash

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules
# Or on Windows: rmdir /s /q node_modules

# Reinstall
npm install
```

### Issue: Database not found

**Solution**:
```bash
npm run db:push
```

### Issue: Port 3000 already in use

**Solution**:
```bash
# Kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use different port:
PORT=3001 npm run dev
```

### Issue: Changes not appearing

**Solutions**:
1. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check if "Publish Changes" was clicked
4. Check browser console for errors (F12)

### Issue: Edit key not working

**Solutions**:
1. Verify `.env.local` has correct key
2. Restart dev server (Ctrl+C, then `npm run dev`)
3. Clear browser localStorage (F12 → Application → Local Storage → Clear)

## All Tests Passed? ✓

If all 20 tests passed:
- ✅ Local installation is successful
- ✅ All features are working
- ✅ Ready for production deployment

## Next Steps

1. **Customize your data**:
   - Go to `/admin`
   - Edit services to match your business
   - Export JSON for backup

2. **Deploy to production**:
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Deploy to Vercel
   - Update WordPress embeds

3. **Read documentation**:
   - [README.md](README.md) - Full documentation
   - [QUICKSTART.md](QUICKSTART.md) - Quick reference
   - [WORDPRESS.md](WORDPRESS.md) - WordPress integration

## Getting Help

If tests fail:
1. Check error messages in terminal
2. Check browser console (F12)
3. Review error message carefully
4. Check relevant documentation
5. Try solutions in "Common Issues" above

For persistent issues:
- Check Node.js version is 18+
- Try fresh install (delete `node_modules`, run `npm install`)
- Check file permissions on `data/` directory
- Verify no firewall blocking localhost:3000

## Success!

Once all tests pass, your TSS Wheel is fully functional and ready to use! 🎉
