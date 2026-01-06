# Quick Start Guide

Get your TSS Wheel running in 5 minutes.

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npm run db:push

# 3. Load demo data
npm run db:seed

# 4. Start dev server
npm run dev
```

Visit:
- **Wheel**: http://localhost:3000/wheel
- **Admin**: http://localhost:3000/admin

**Default edit key**: `your-secret-edit-key-change-this` (from `.env.local`)

## Deploy to Vercel (Production)

### One-Command Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Set Environment Variables

In Vercel dashboard, add:

```
DATABASE_PATH=/tmp/tss-wheel.db
EDIT_KEY=<your-strong-password>
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Then redeploy:

```bash
vercel --prod
```

## Embed in WordPress

### Simple Copy-Paste

Replace `YOUR_URL` with your Vercel deployment URL:

```html
<div id="tss-wheel"></div>
<script src="YOUR_URL/embed.js" async></script>
```

**Example**:
```html
<div id="tss-wheel"></div>
<script src="https://tss-wheel.vercel.app/embed.js" async></script>
```

Add this to any WordPress page using the **HTML block**.

## Edit Your Wheel

1. Go to `/admin`
2. Enter your edit key
3. Expand a service to edit
4. Add/edit/delete services and subservices
5. Click **"Publish Changes"**
6. Changes appear immediately on `/wheel`

## Backup Your Data

Before redeploying to Vercel:

1. Go to `/admin`
2. Click **"Export JSON"**
3. Save the file
4. After redeployment, click **"Import JSON"** and upload

## Common Issues

**Can't access admin**:
- Check your edit key in `.env.local` or Vercel env vars
- Clear browser localStorage and try again

**Changes not saving**:
- Check browser console for errors
- Verify edit key is correct (401 = wrong key)

**Wheel not showing in WordPress**:
- Check embed script URL is correct
- Verify `<div id="tss-wheel"></div>` exists
- Check browser console for errors

## Next Steps

- Customize colors in admin
- Add your own services/subservices
- Adjust weights for accurate representation
- Export JSON for version control
- Read full [README.md](README.md) for advanced features
