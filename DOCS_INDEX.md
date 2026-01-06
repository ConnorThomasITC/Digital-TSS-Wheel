# Documentation Index

Complete guide to all TSS Wheel documentation.

## 📚 Documentation Overview

This project includes comprehensive documentation organized by audience and use case.

## 🚀 Getting Started

**New to the project? Start here:**

1. **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
   - Fastest way to get running locally
   - Simple deploy to Vercel
   - Quick WordPress embedding

2. **[INSTALL_GUIDE.md](INSTALL_GUIDE.md)** - Complete installation & testing
   - Step-by-step installation
   - 20-point testing checklist
   - Troubleshooting common issues

## 📖 Core Documentation

**Complete reference documentation:**

3. **[README.md](README.md)** - Main documentation
   - Full technical overview
   - Features and capabilities
   - API reference
   - Database schema
   - Security model
   - Development guide
   - Troubleshooting

4. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Executive overview
   - Architecture decisions
   - Technology justifications
   - File structure
   - Key features
   - Success criteria
   - Future enhancements

## 🚢 Deployment

**Production deployment resources:**

5. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
   - Pre-deployment checklist
   - Vercel deployment steps
   - Environment variable setup
   - Custom domain configuration
   - Data persistence strategy
   - Rollback procedures
   - Security hardening
   - Monitoring & maintenance

## 🔌 Integration

**WordPress and embedding guides:**

6. **[WORDPRESS.md](WORDPRESS.md)** - WordPress integration
   - HTML block embed
   - Iframe embed
   - JavaScript embed
   - Shortcode implementation
   - Widget integration
   - Theme template integration
   - Styling tips
   - Troubleshooting
   - Performance optimization
   - Security considerations
   - Complete examples

## 📂 File Structure

```
Documentation Files:
├── README.md              # Main technical documentation
├── QUICKSTART.md          # 5-minute setup guide
├── INSTALL_GUIDE.md       # Installation & testing checklist
├── DEPLOYMENT.md          # Production deployment guide
├── WORDPRESS.md           # WordPress integration guide
├── PROJECT_SUMMARY.md     # Executive overview
└── DOCS_INDEX.md          # This file

Configuration Files:
├── .env.local             # Local environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment config
├── postcss.config.js      # PostCSS configuration
├── .gitignore             # Git ignore rules
└── .gitattributes         # Git attributes

Source Code:
└── src/
    ├── app/               # Next.js pages and API routes
    ├── components/        # React components
    ├── lib/               # Utilities and database
    └── styles/            # Global styles

Public Assets:
└── public/
    └── embed.js           # WordPress embed script
```

## 📋 Quick Reference

### For Developers

**Setting up locally**:
1. Start: [INSTALL_GUIDE.md](INSTALL_GUIDE.md)
2. Reference: [README.md](README.md)
3. Deploy: [DEPLOYMENT.md](DEPLOYMENT.md)

**Making changes**:
- File structure: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md#file-structure)
- API endpoints: [README.md](README.md#api-reference)
- Database schema: [README.md](README.md#database-schema)

### For DevOps/Deployment

**Deploying to production**:
1. Checklist: [DEPLOYMENT.md](DEPLOYMENT.md#pre-deployment-checklist)
2. Vercel setup: [DEPLOYMENT.md](DEPLOYMENT.md#vercel-deployment)
3. Environment vars: [DEPLOYMENT.md](DEPLOYMENT.md#environment-variables-in-vercel)
4. Data backup: [DEPLOYMENT.md](DEPLOYMENT.md#data-persistence-strategy)

### For WordPress Integrators

**Embedding in WordPress**:
1. Quick embed: [QUICKSTART.md](QUICKSTART.md#embed-in-wordpress)
2. Full guide: [WORDPRESS.md](WORDPRESS.md)
3. Troubleshooting: [WORDPRESS.md](WORDPRESS.md#troubleshooting)

**Common tasks**:
- Iframe embed: [WORDPRESS.md](WORDPRESS.md#method-2-iframe-embed)
- Script embed: [WORDPRESS.md](WORDPRESS.md#method-1-html-block-embed-recommended)
- Shortcode: [WORDPRESS.md](WORDPRESS.md#method-3-shortcode-advanced)

### For Content Managers

**Managing the wheel**:
1. Access admin: Navigate to `/admin`
2. Enter edit key (from IT team)
3. Edit services/subservices
4. Click "Publish Changes"

**Backup/restore**:
- Export: [README.md](README.md#backup--restore)
- Import: [README.md](README.md#backup--restore)

## 🔍 Finding Information

### By Topic

| Topic | Document | Section |
|-------|----------|---------|
| **Installation** | INSTALL_GUIDE.md | Full guide |
| **Quick Setup** | QUICKSTART.md | All sections |
| **API Endpoints** | README.md | API Reference |
| **Database Schema** | README.md | Database Schema |
| **Environment Variables** | README.md, DEPLOYMENT.md | Multiple |
| **WordPress Embed** | WORDPRESS.md | Methods 1-5 |
| **Vercel Deployment** | DEPLOYMENT.md | Vercel Deployment |
| **Security** | README.md, DEPLOYMENT.md | Security sections |
| **Troubleshooting** | All docs | Troubleshooting sections |
| **Architecture** | PROJECT_SUMMARY.md | Technical Architecture |

### By User Role

| Role | Recommended Reading |
|------|---------------------|
| **Developer** | INSTALL_GUIDE.md → README.md → PROJECT_SUMMARY.md |
| **DevOps Engineer** | DEPLOYMENT.md → README.md |
| **WordPress Admin** | QUICKSTART.md → WORDPRESS.md |
| **Content Manager** | Admin UI (no docs needed) + backup section in README.md |
| **Project Manager** | PROJECT_SUMMARY.md → QUICKSTART.md |
| **Stakeholder** | PROJECT_SUMMARY.md only |

### By Task

| Task | Start Here |
|------|------------|
| **First-time setup** | INSTALL_GUIDE.md |
| **Deploy to production** | DEPLOYMENT.md |
| **Add to WordPress** | WORDPRESS.md |
| **Understand architecture** | PROJECT_SUMMARY.md |
| **Edit wheel content** | Navigate to `/admin` |
| **Backup data** | README.md → Backup & Restore |
| **Fix an issue** | Search "troubleshooting" in relevant doc |
| **Add new feature** | README.md → Development section |

## 📞 Getting Help

### Step 1: Check Documentation

Search these docs in order:
1. README.md - Most comprehensive
2. Relevant specialized doc (WORDPRESS.md, DEPLOYMENT.md, etc.)
3. INSTALL_GUIDE.md - Testing and troubleshooting

### Step 2: Check Browser Console

Open browser dev tools (F12) and check:
- Console tab for JavaScript errors
- Network tab for failed requests
- Application tab for localStorage issues

### Step 3: Check Server Logs

For Vercel deployments:
- Vercel Dashboard → Your Project → Logs
- Function logs show API errors

### Step 4: Common Issues

Most issues fall into these categories:
- **Edit key problems**: [DEPLOYMENT.md](DEPLOYMENT.md#edit-key-not-working)
- **Database issues**: [INSTALL_GUIDE.md](INSTALL_GUIDE.md#issue-database-not-found)
- **Build failures**: [DEPLOYMENT.md](DEPLOYMENT.md#build-fails)
- **WordPress embed**: [WORDPRESS.md](WORDPRESS.md#troubleshooting)

## 🔄 Updates & Versioning

### Documentation Updates

When code changes:
1. Update README.md with technical changes
2. Update relevant specialized docs
3. Update PROJECT_SUMMARY.md if architecture changes
4. Update version in package.json

### Keeping Current

Check these files for version info:
- `package.json` - Current version
- `PROJECT_SUMMARY.md` - Architecture version
- Git commits - Change history

## 🎯 Documentation Quality

All documentation follows these principles:

✅ **Comprehensive**: Covers all features and use cases
✅ **Searchable**: Organized with clear headings and index
✅ **Task-Oriented**: Organized by what users want to accomplish
✅ **Example-Rich**: Includes code samples and screenshots references
✅ **Troubleshooting**: Includes common issues and solutions
✅ **Up-to-Date**: Matches current codebase

## 📝 Documentation Checklist

Use this when updating docs:

- [ ] README.md updated with new features
- [ ] Relevant specialized doc updated
- [ ] Code examples tested and working
- [ ] Links between docs checked
- [ ] Index updated (this file)
- [ ] Troubleshooting section updated if needed

## 🎓 Learning Path

**Suggested reading order for new team members:**

### Day 1: Getting Started
1. Read: PROJECT_SUMMARY.md (10 min)
2. Follow: QUICKSTART.md (15 min)
3. Complete: INSTALL_GUIDE.md tests (30 min)

### Day 2: Deep Dive
4. Read: README.md (45 min)
5. Browse: Source code structure (30 min)
6. Experiment: Make local changes (60 min)

### Day 3: Deployment
7. Read: DEPLOYMENT.md (30 min)
8. Practice: Deploy to Vercel preview (30 min)
9. Read: WORDPRESS.md (20 min)

### Week 1: Mastery
10. Build: Custom feature
11. Document: Your changes
12. Deploy: To production
13. Integrate: With WordPress

## 📚 External Resources

**Technologies Used:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [React Documentation](https://react.dev/)

**Related Guides:**
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [WordPress Custom HTML](https://wordpress.org/support/article/wordpress-editor/)

## ✨ Quick Links

**Most Accessed Pages:**
- [Quick Start](QUICKSTART.md)
- [API Reference](README.md#api-reference)
- [WordPress Embed](WORDPRESS.md#method-1-html-block-embed-recommended)
- [Deployment Checklist](DEPLOYMENT.md#pre-deployment-checklist)
- [Troubleshooting](README.md#troubleshooting)

**Configuration Files:**
- [Environment Variables](.env.example)
- [Package.json](package.json)
- [Vercel Config](vercel.json)

**Source Code:**
- [Wheel Component](src/components/Wheel.tsx)
- [Admin Dashboard](src/components/AdminDashboard.tsx)
- [Database Layer](src/lib/db.ts)
- [API Routes](src/app/api/)

---

**Need help?** Use Ctrl+F / Cmd+F to search this index, then jump to the relevant document.

**Pro tip**: Keep this file open as a reference while working on the project!
