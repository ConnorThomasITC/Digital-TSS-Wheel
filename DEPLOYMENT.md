# Deployment Checklist

Complete guide for deploying TSS Wheel to production.

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure these are set in production:

- [ ] `DATABASE_PATH` - Set to `/tmp/tss-wheel.db` for Vercel
- [ ] `EDIT_KEY` - **Strong, unique password** (not default!)
- [ ] `NEXT_PUBLIC_APP_URL` - Your production URL

### 2. Security

- [ ] Changed default `EDIT_KEY` from example
- [ ] Edit key is at least 20 characters
- [ ] Edit key uses mix of letters, numbers, symbols
- [ ] Edit key is stored securely (password manager)
- [ ] Team members who need access have the key

### 3. Content

- [ ] Seeded demo data OR imported your own
- [ ] Tested all services display correctly
- [ ] Verified tooltips show on hover
- [ ] Confirmed modals open on click
- [ ] Checked subservice weights are accurate
- [ ] Reviewed all colors for brand consistency

### 4. Testing

- [ ] Tested on desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Tested on mobile devices (iOS Safari, Android Chrome)
- [ ] Verified responsive behavior
- [ ] Tested admin dashboard functionality
- [ ] Confirmed export/import works
- [ ] Validated embed script in test WordPress site

## Vercel Deployment

### Option 1: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to preview
vercel

# 4. Set environment variables (one-time)
# Go to Vercel dashboard > Project > Settings > Environment Variables
# Add: DATABASE_PATH, EDIT_KEY, NEXT_PUBLIC_APP_URL

# 5. Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/tss-wheel.git
git push -u origin main

# 2. In Vercel dashboard:
# - Click "Add New Project"
# - Import your GitHub repository
# - Configure environment variables
# - Deploy
```

### Environment Variables in Vercel

Navigate to: **Vercel Dashboard > Your Project > Settings > Environment Variables**

Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_PATH` | `/tmp/tss-wheel.db` | Production, Preview, Development |
| `EDIT_KEY` | `your-strong-password` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-app-git-branch.vercel.app` | Preview |

**Important**: After adding env vars, redeploy:

```bash
vercel --prod
```

## Post-Deployment Checklist

### 1. Verify Deployment

- [ ] Visit production URL (e.g., `https://tss-wheel.vercel.app`)
- [ ] Wheel page loads: `/wheel`
- [ ] Admin page loads: `/admin`
- [ ] Embed script accessible: `/embed.js`

### 2. Test Functionality

- [ ] Wheel displays correctly
- [ ] Hover shows tooltips
- [ ] Click opens modal
- [ ] Modal displays service description
- [ ] Subservices chart renders
- [ ] Modal closes with X button
- [ ] Modal closes with ESC key
- [ ] Mobile tap interactions work

### 3. Test Admin

- [ ] Can access `/admin`
- [ ] Edit key authentication works
- [ ] Can view all services
- [ ] Can edit service name
- [ ] Can change service color
- [ ] Can add new service
- [ ] Can delete service
- [ ] Can add subservice
- [ ] Can edit subservice weight
- [ ] Can export JSON
- [ ] Can import JSON
- [ ] "Publish Changes" saves successfully
- [ ] Changes appear on `/wheel` immediately

### 4. Test Embedding

**Iframe Test**:
- [ ] Create test HTML file with iframe embed
- [ ] Wheel displays in iframe
- [ ] Iframe is responsive
- [ ] No scrollbars within iframe

**Script Test**:
- [ ] Create test HTML file with script embed
- [ ] Wheel renders in container
- [ ] Auto-adjusts height

**WordPress Test**:
- [ ] Add embed to WordPress test page
- [ ] Wheel displays correctly
- [ ] Responsive on mobile
- [ ] Interactions work

### 5. Performance

- [ ] Lighthouse score > 90 (run on `/wheel`)
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] No 404 errors in Network tab

### 6. SEO & Accessibility

- [ ] Meta tags present (title, description)
- [ ] Accessible via keyboard navigation
- [ ] ARIA labels on interactive elements
- [ ] Tooltips accessible
- [ ] Modal has focus trap

## Data Persistence Strategy

### Important: Vercel SQLite Limitations

SQLite on Vercel is **ephemeral** - data resets on:
- New deployments
- Function cold starts (sometimes)
- Region changes

### Recommended Workflow

**Before Each Deployment**:

1. Go to production `/admin`
2. Click "Export JSON"
3. Save file with timestamp
4. Commit to git:
   ```bash
   git add data/backup-YYYY-MM-DD.json
   git commit -m "Backup before deployment"
   ```

**After Each Deployment**:

1. Go to production `/admin`
2. Click "Import JSON"
3. Upload latest backup
4. Click "Publish Changes"

### Automated Backup (Advanced)

Create a cron job or GitHub Action to periodically backup:

```bash
# .github/workflows/backup.yml
name: Backup TSS Wheel Data

on:
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday
  workflow_dispatch: # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Download backup
        run: |
          curl "https://your-app.vercel.app/api/export?key=${{ secrets.EDIT_KEY }}" \
            -o data/backup-$(date +%Y-%m-%d).json
      - name: Commit backup
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add data/
          git commit -m "Automated backup $(date +%Y-%m-%d)" || exit 0
          git push
```

### Migration to Persistent Database (Optional)

For production persistence, migrate to:

#### Option A: Vercel Postgres

```bash
# 1. Enable Vercel Postgres in dashboard
# 2. Migrate schema:
# Update src/lib/db.ts to use @vercel/postgres
# 3. Seed data via import
```

#### Option B: Supabase

```bash
# 1. Create Supabase project
# 2. Get connection string
# 3. Update DATABASE_URL env var
# 4. Update src/lib/db.ts to use Supabase client
```

#### Option C: PlanetScale

```bash
# 1. Create PlanetScale database
# 2. Get connection string
# 3. Update to use MySQL adapter
# 4. Migrate schema
```

## Custom Domain Setup

### 1. Add Domain in Vercel

- Go to **Project Settings > Domains**
- Click "Add Domain"
- Enter your domain (e.g., `services.yourdomain.com`)

### 2. Configure DNS

Add DNS record at your domain provider:

**Option A: CNAME (Recommended)**
```
Type:  CNAME
Name:  services (or @ for root domain)
Value: cname.vercel-dns.com
```

**Option B: A Record**
```
Type:  A
Name:  services (or @ for root domain)
Value: 76.76.21.21
```

### 3. Update Environment Variable

Update `NEXT_PUBLIC_APP_URL`:
```
NEXT_PUBLIC_APP_URL=https://services.yourdomain.com
```

Redeploy:
```bash
vercel --prod
```

### 4. Update Embeds

Update all WordPress embeds with new domain:
```html
<div id="tss-wheel"></div>
<script src="https://services.yourdomain.com/embed.js" async></script>
```

## Rollback Procedure

If deployment fails or has issues:

### Vercel Dashboard Method

1. Go to **Deployments** tab
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

### CLI Method

```bash
vercel rollback
```

### Manual Method

```bash
# Revert to previous commit
git log --oneline
git checkout <previous-commit-hash>

# Redeploy
vercel --prod
```

## Monitoring & Maintenance

### Weekly Tasks

- [ ] Export JSON backup
- [ ] Review Vercel function logs for errors
- [ ] Check analytics for usage patterns
- [ ] Verify wheel still displays correctly

### Monthly Tasks

- [ ] Update dependencies: `npm update`
- [ ] Review security advisories: `npm audit`
- [ ] Test all admin functionality
- [ ] Review and archive old backups

### Quarterly Tasks

- [ ] Review edit key security
- [ ] Consider rotating edit key
- [ ] Evaluate migration to persistent database
- [ ] Review performance metrics

## Troubleshooting Deployment Issues

### Build Fails

**Error**: `Module not found: Can't resolve 'better-sqlite3'`

**Solution**: Check `next.config.js` has webpack externals:
```javascript
config.externals.push('better-sqlite3');
```

### Function Timeout

**Error**: `Function execution timed out`

**Solution**: Optimize database queries or increase timeout in `vercel.json`:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### Database Not Found

**Error**: `SQLITE_CANTOPEN: unable to open database file`

**Solution**: Ensure `DATABASE_PATH` is set and directory is writable:
```env
DATABASE_PATH=/tmp/tss-wheel.db
```

### CORS Errors

**Error**: `Blocked by CORS policy`

**Solution**: Verify `vercel.json` has CORS headers:
```json
{
  "headers": [
    {
      "source": "/embed.js",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

### Edit Key Not Working

**Error**: `401 Unauthorized` when publishing

**Solutions**:
1. Verify `EDIT_KEY` env var is set in Vercel
2. Check key matches exactly (no spaces)
3. Clear localStorage and re-enter key
4. Check key is same across all environments

## Security Hardening

### Rotate Edit Key

```bash
# 1. Generate new strong key
openssl rand -base64 32

# 2. Update in Vercel dashboard
# Project > Settings > Environment Variables > EDIT_KEY

# 3. Redeploy
vercel --prod

# 4. Notify team members
# 5. Update in password manager
```

### Add Rate Limiting (Optional)

Use Vercel Edge Config or Upstash Redis:

```typescript
// src/lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

### IP Allowlist (Optional)

```typescript
// src/lib/auth.ts
const ALLOWED_IPS = process.env.ALLOWED_IPS?.split(',') || [];

export function validateIP(request: Request): boolean {
  const ip = request.headers.get('x-forwarded-for');
  if (!ip) return false;
  return ALLOWED_IPS.includes(ip);
}
```

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: Your repository issues page
- **Internal Team**: Your development team contact

## Success Criteria

Deployment is successful when:

- [x] Wheel page loads without errors
- [x] Admin dashboard accessible with edit key
- [x] Can create, edit, delete services
- [x] Can export/import JSON
- [x] Changes publish successfully
- [x] Embed script works in WordPress
- [x] Mobile responsive
- [x] No console errors
- [x] Lighthouse score > 85
- [x] Backups automated or scheduled

Congratulations on your successful deployment! 🎉
