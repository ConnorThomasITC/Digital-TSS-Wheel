# GitHub Publishing Guide

Step-by-step guide to publish TSS Wheel to your GitHub repository.

## Prerequisites

- GitHub account with access to `digital-tss-wheel` repository
- Git installed on your computer

## Option 1: Automated Script (Recommended)

### Step 1: Double-click `GITHUB_SETUP.bat`

The script will:
1. Check if Git is installed
2. Initialize git repository
3. Add all files
4. Create initial commit
5. Connect to your GitHub repository
6. Push the code

### Step 2: Follow the prompts

You'll be asked for:
- Your GitHub username
- Confirmation to push

## Option 2: Manual Commands

If you prefer to run commands manually:

### Step 1: Open Command Prompt in Project Folder

```cmd
cd "C:\Users\MohamedGalal\OneDrive - ITC SERVICE LIMITED\Documents\Software\Digital TSS Wheel"
```

### Step 2: Initialize Git Repository

```cmd
git init
```

### Step 3: Add All Files

```cmd
git add .
```

### Step 4: Create Initial Commit

```cmd
git commit -m "Initial commit: TSS Wheel standalone application"
```

### Step 5: Connect to GitHub

Replace `YOUR_GITHUB_USERNAME` with your actual username:

```cmd
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/digital-tss-wheel.git
```

### Step 6: Rename Branch to Main

```cmd
git branch -M main
```

### Step 7: Push to GitHub

```cmd
git push -u origin main
```

You'll be prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (see below)

## Creating a GitHub Repository (if needed)

If the `digital-tss-wheel` repository doesn't exist yet:

1. Go to: https://github.com/new
2. **Repository name**: `digital-tss-wheel`
3. **Description**: "Interactive TSS service wheel with admin dashboard"
4. **Visibility**:
   - ✅ Private (recommended - keeps edit key secret)
   - ⚠️ Public (only if you want it public)
5. ✅ Do NOT check "Add a README file"
6. ✅ Do NOT add .gitignore (we already have one)
7. ✅ Do NOT choose a license yet
8. Click **"Create repository"**

## Creating a Personal Access Token

GitHub no longer accepts passwords for git operations. You need a token:

### Step 1: Generate Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Note**: "TSS Wheel Deploy"
4. **Expiration**: Choose 90 days or No expiration
5. **Select scopes**:
   - ✅ Check `repo` (full control of private repositories)
6. Scroll down, click **"Generate token"**
7. **Copy the token** (you won't see it again!)

### Step 2: Use Token as Password

When `git push` asks for password, paste the token instead.

## Files That Will Be Pushed

### Included (✅):
- All source code (`src/` folder)
- Documentation (all `.md` files)
- Configuration files (`.json`, `.js`, `.ts`)
- Scripts (`.bat` files)
- `.gitignore` (prevents sensitive files)

### Excluded (❌ by .gitignore):
- `node_modules/` (dependencies - too large)
- `data/` folder (database - contains local data)
- `.env.local` (secrets - contains edit key)
- `.next/` (build files)
- `*.db` (database files)

## After Pushing to GitHub

### 1. Verify Upload

1. Go to: https://github.com/YOUR_USERNAME/digital-tss-wheel
2. Check that all files are there
3. Verify README.md displays correctly

### 2. Set Repository Secrets (for CI/CD)

If you plan to use GitHub Actions:

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add:
   - `EDIT_KEY`: Your edit key
   - Any other secrets needed

### 3. Deploy to Vercel

Two options:

**Option A: Connect GitHub to Vercel (Recommended)**
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `digital-tss-wheel` repository
4. Add environment variables (see DEPLOYMENT.md)
5. Click "Deploy"
6. Every push to `main` branch will auto-deploy!

**Option B: Deploy via CLI**
```cmd
npm install -g vercel
vercel
```

## Updating the Repository

After making changes:

```cmd
git add .
git commit -m "Description of changes"
git push
```

Or use this script:

```cmd
@echo off
set /p MESSAGE="Commit message: "
git add .
git commit -m "%MESSAGE%"
git push
echo Done!
pause
```

Save as `QUICK_COMMIT.bat` in project folder.

## Troubleshooting

### "Git is not recognized"

**Solution**: Install Git for Windows
1. Download: https://git-scm.com/download/win
2. Run installer (defaults are fine)
3. Restart Command Prompt
4. Try again

### "Repository not found"

**Solutions**:
1. Make sure repository exists on GitHub
2. Check repository name is exactly `digital-tss-wheel`
3. Verify you have access to the repository
4. Check remote URL: `git remote get-url origin`

### "Authentication failed"

**Solutions**:
1. Use Personal Access Token, not password
2. Make sure token has `repo` scope
3. Token hasn't expired
4. Username is correct

### "Updates were rejected"

**Solution**: Someone else pushed changes first
```cmd
git pull origin main --rebase
git push origin main
```

### "Fatal: not a git repository"

**Solution**: Initialize git first
```cmd
git init
```

### Large files warning

If you get warnings about large files:

**Solution**: They should already be in `.gitignore`
```cmd
# Check what's trying to be committed
git status

# If node_modules or .next are showing:
git rm -r --cached node_modules
git rm -r --cached .next
git commit -m "Remove large files"
```

## Security Notes

### ✅ Safe to Push:
- Source code
- Documentation
- Configuration templates (`.env.example`)
- Build scripts

### ❌ Never Push:
- `.env.local` (contains secrets) - ✅ Already in `.gitignore`
- `node_modules/` (too large) - ✅ Already in `.gitignore`
- `data/*.db` (local database) - ✅ Already in `.gitignore`
- Personal access tokens
- API keys
- Passwords

## Best Practices

### Commit Messages

Use clear, descriptive messages:
- ✅ "Add color picker to admin dashboard"
- ✅ "Fix tooltip positioning on mobile"
- ✅ "Update deployment documentation"
- ❌ "Update"
- ❌ "Changes"
- ❌ "Fix stuff"

### Branch Strategy

For solo development:
- Work directly on `main` branch (simplest)

For team development:
- Create feature branches
- Use pull requests
- Review before merging

### Regular Backups

Even with GitHub:
1. Export JSON from admin dashboard weekly
2. Keep backup folder outside project
3. Commit important milestones

## Next Steps

After pushing to GitHub:

1. ✅ Verify code is on GitHub
2. ✅ Set up Vercel deployment
3. ✅ Configure environment variables in Vercel
4. ✅ Deploy to production
5. ✅ Test live site
6. ✅ Embed in WordPress

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guide.

## Quick Reference

```cmd
# Status check
git status

# View changes
git diff

# Add files
git add .

# Commit
git commit -m "Message"

# Push
git push

# Pull latest
git pull

# View history
git log --oneline

# View remote
git remote -v
```

## Need Help?

- **Git documentation**: https://git-scm.com/doc
- **GitHub guides**: https://guides.github.com/
- **Vercel deployment**: https://vercel.com/docs
- **Project issues**: Check DEPLOYMENT.md troubleshooting
