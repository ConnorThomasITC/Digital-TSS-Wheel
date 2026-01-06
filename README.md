# TSS Wheel - Interactive Service Visualization

A standalone web application for displaying and managing an interactive service wheel with weighted subservices and a public admin dashboard.

## Features

- **Interactive Wheel**: SVG-based circular visualization of main services
- **Service Details**: Click to view modal with service descriptions and weighted subservice breakdown
- **Public Admin Dashboard**: Edit services, subservices, colors, weights, and tooltips without touching code
- **WordPress Integration**: Embed via iframe or JavaScript snippet
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessible**: ARIA labels, keyboard navigation, focus management
- **Export/Import**: Backup and restore configuration as JSON

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3
- **Deployment**: Vercel (recommended)
- **Security**: Edit key protection for admin access

## Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Clone and install dependencies**:

```bash
cd "Digital TSS Wheel"
npm install
```

2. **Configure environment variables**:

Edit `.env.local`:

```env
DATABASE_PATH=./data/tss-wheel.db
EDIT_KEY=your-secret-edit-key-change-this
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**IMPORTANT**: Change `EDIT_KEY` to a strong, unique password.

3. **Initialize database**:

```bash
npm run db:push
```

4. **Seed demo data** (optional):

```bash
npm run db:seed
```

5. **Run development server**:

```bash
npm run dev
```

Visit:
- Wheel: http://localhost:3000/wheel
- Admin: http://localhost:3000/admin

## Deployment to Vercel

### Option A: CLI Deployment

1. **Install Vercel CLI**:

```bash
npm i -g vercel
```

2. **Deploy**:

```bash
vercel
```

3. **Set environment variables** in Vercel dashboard:

```
DATABASE_PATH=/tmp/tss-wheel.db
EDIT_KEY=your-production-edit-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. **Redeploy** to apply env vars:

```bash
vercel --prod
```

### Option B: GitHub Integration

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy automatically on push

### Important Notes for Production

- SQLite data is **ephemeral** on Vercel (resets on deployment)
- Use **Export JSON** in admin to backup before redeploying
- Use **Import JSON** after deployment to restore
- For persistent storage, consider:
  - Vercel Postgres (requires schema migration)
  - Supabase
  - PlanetScale

## WordPress Integration

### Option 1: Iframe Embed (Simplest)

Add this to your WordPress page/post (HTML block):

```html
<iframe
  src="https://your-app-domain.vercel.app/wheel"
  width="100%"
  height="600"
  frameborder="0"
  title="TSS Services Wheel"
  style="max-width: 800px; margin: 0 auto; display: block;"
></iframe>
```

### Option 2: JavaScript Embed (Recommended)

Add this to your WordPress page/post (HTML block):

```html
<div id="tss-wheel"></div>
<script src="https://your-app-domain.vercel.app/embed.js" async></script>
```

This method:
- Auto-adjusts height based on container width
- Better responsive behavior
- Lazy loads the wheel

### Option 3: Shortcode (Advanced)

Add this to your theme's `functions.php`:

```php
function tss_wheel_shortcode($atts) {
    $atts = shortcode_atts(array(
        'url' => 'https://your-app-domain.vercel.app',
    ), $atts);

    return '<div id="tss-wheel"></div>
            <script src="' . esc_url($atts['url']) . '/embed.js" async></script>';
}
add_shortcode('tss_wheel', 'tss_wheel_shortcode');
```

Then use in posts/pages:

```
[tss_wheel]
```

Or with custom URL:

```
[tss_wheel url="https://custom-domain.com"]
```

## Admin Dashboard Usage

### Accessing the Dashboard

1. Navigate to `/admin`
2. Enter your edit key (from `EDIT_KEY` env var)
3. Key is stored in localStorage for convenience

### Managing Services

**Add Service**:
- Click "+ Add Service"
- Fill in name, tooltip, description, and color
- Click "Publish Changes"

**Edit Service**:
- Click "Expand" on a service
- Modify fields
- Click "Publish Changes"

**Reorder Services**:
- Use ▲/▼ arrows to move services
- Order affects wheel display (clockwise from top)

**Delete Service**:
- Click "Delete" and confirm
- Cascades to all subservices

### Managing Subservices

**Add Subservice**:
- Expand a service
- Click "+ Add" in Subservices section
- Fill in name, tooltip, color, and weight

**Edit Subservice**:
- Click "Edit" on a subservice
- Modify fields
- Weight determines visual proportion in modal chart

**Weight System**:
- Each subservice has a weight (1-100+)
- Weights are normalized to 100% per service
- Example: weights [30, 20, 10] become [50%, 33.3%, 16.7%]

### Backup & Restore

**Export**:
- Click "Export JSON"
- Downloads timestamped JSON file
- Contains all services and subservices

**Import**:
- Click "Import JSON"
- Select previously exported file
- Review changes, then click "Publish Changes"

### Live Preview

- Click "Show Preview" to see wheel in real-time
- Updates as you edit (before publishing)
- Test hover tooltips and click modals

## API Reference

### Public Endpoints

#### GET /api/config
Fetch full configuration (public, no auth required).

**Response**:
```json
{
  "services": [...],
  "lastUpdated": "2025-01-06T12:00:00.000Z"
}
```

### Protected Endpoints (require `?key=EDIT_KEY`)

#### POST /api/config
Replace entire configuration.

**Body**:
```json
{
  "services": [
    {
      "name": "Service Name",
      "tooltip": "Hover text",
      "description": "Modal description",
      "color": "#FF6B6B",
      "sort_order": 0,
      "subservices": [
        {
          "name": "Subservice",
          "tooltip": "Subservice hover",
          "color": "#FF5252",
          "weight": 30,
          "sort_order": 0
        }
      ]
    }
  ]
}
```

#### POST /api/services
Create new service.

#### PUT /api/services/:id
Update service.

#### DELETE /api/services/:id
Delete service.

#### POST /api/subservices
Create new subservice.

#### PUT /api/subservices/:id
Update subservice.

#### DELETE /api/subservices/:id
Delete subservice.

#### POST /api/reorder
Reorder services or subservices.

**Body**:
```json
{
  "type": "services",
  "ids": [3, 1, 2, 4]
}
```

#### GET /api/export
Export configuration as JSON.

## Database Schema

### services
```sql
id              INTEGER PRIMARY KEY
name            TEXT NOT NULL
tooltip         TEXT
description     TEXT
color           TEXT NOT NULL
sort_order      INTEGER DEFAULT 0
created_at      DATETIME
updated_at      DATETIME
```

### subservices
```sql
id              INTEGER PRIMARY KEY
service_id      INTEGER NOT NULL (FK services.id)
name            TEXT NOT NULL
tooltip         TEXT
color           TEXT NOT NULL
weight          INTEGER DEFAULT 10
sort_order      INTEGER DEFAULT 0
created_at      DATETIME
updated_at      DATETIME
```

## Security

### Edit Key Protection

- All write operations require `?key=EDIT_KEY` query parameter
- Key is validated server-side
- 401 Unauthorized if key is missing or incorrect
- Stored in localStorage on client for UX

### Rotating the Edit Key

1. Update `EDIT_KEY` in `.env.local` (local) or Vercel dashboard (production)
2. Redeploy (Vercel CLI: `vercel --prod`)
3. Notify admins of new key
4. Clear localStorage in browser (or logout/login in admin)

### Additional Protections (Optional)

Add to `src/lib/auth.ts`:

**Rate Limiting**:
```typescript
// Implement with Vercel Edge Config or Upstash Redis
```

**IP Allowlist**:
```typescript
export function validateIP(request: Request): boolean {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip');
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
  return allowedIPs.includes(ip);
}
```

## Troubleshooting

### Database not found
```bash
npm run db:push
```

### Changes not appearing after publish
- Check browser console for errors
- Verify edit key is correct
- Check Vercel function logs

### Wheel not displaying in WordPress
- Check browser console for CORS errors
- Verify iframe src URL is correct
- Ensure embed.js is loading (check Network tab)

### Mobile touch not working
- Implemented: first tap shows tooltip, second tap opens modal
- Fallback: 3-second timeout clears tooltip

## Development

### File Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Admin dashboard page
│   ├── wheel/        # Public wheel page
│   └── layout.tsx    # Root layout
├── components/
│   ├── Wheel.tsx              # Main wheel SVG
│   ├── ServiceModal.tsx       # Click modal
│   ├── WeightedChart.tsx      # Donut chart
│   ├── Tooltip.tsx            # Hover tooltip
│   ├── AdminDashboard.tsx     # Full admin UI
│   └── ColorPicker.tsx        # Color input
├── lib/
│   ├── db.ts         # Database operations
│   ├── auth.ts       # Edit key validation
│   └── types.ts      # TypeScript types
└── styles/
    └── globals.css   # Global styles
```

### Adding Features

**New field to services**:
1. Update `src/lib/types.ts`
2. Update database schema in `src/lib/db.ts`
3. Add to admin form in `src/components/AdminDashboard.tsx`
4. Use in `src/components/Wheel.tsx` or `ServiceModal.tsx`

**New API endpoint**:
1. Create `src/app/api/your-endpoint/route.ts`
2. Import auth helpers from `src/lib/auth.ts`
3. Import DB functions from `src/lib/db.ts`

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact your development team.
