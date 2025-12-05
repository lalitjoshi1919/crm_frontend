# Vercel Deployment Guide

This guide will help you deploy your CRM Ticket application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier is fine)
2. Your project pushed to GitHub/GitLab/Bitbucket (recommended) or you can deploy directly

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub/GitLab/Bitbucket account

2. **Import Your Project**
   - Click "Add New Project"
   - Import your Git repository (or drag & drop the `crm_ticket` folder)
   - If importing from Git, select the repository

3. **Configure Project Settings**
   - **Root Directory**: Set to `crm_ticket` (if deploying from monorepo)
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables**
   - Click "Environment Variables"
   - Add your environment variables:
     ```
     VITE_API_URL=https://crm-backend-1-qyl1.onrender.com/v1/
     ```
   - Or add any other environment variables your app needs

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**
   ```bash
   cd crm_ticket
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts:
     - Link to existing project? No (first time)
     - Project name: (press enter for default)
     - Directory: `./` (current directory)
     - Override settings? No

5. **Set Environment Variables** (if needed)
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://crm-backend-1-qyl1.onrender.com/v1/
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Project Structure

Your project structure:
```
Final_Project/
├── crm_ticket/          # Frontend (React/Vite) - Deploy this to Vercel
│   ├── vercel.json      # Vercel configuration
│   ├── package.json
│   └── src/
└── client-api/          # Backend (Express) - Already on Render
    └── app.js
```

## Important Notes

### Frontend Deployment
- ✅ The `crm_ticket` folder is ready for Vercel deployment
- ✅ `vercel.json` is already configured
- ✅ Environment variables should be set in Vercel dashboard

### Backend API
- Your backend is currently hosted on Render at: `https://crm-backend-1-qyl1.onrender.com/v1/`
- Make sure CORS is configured to allow your Vercel domain
- Update `FRONTEND_URL` in your backend environment variables to include your Vercel URL

### CORS Configuration
After deployment, update your backend CORS settings to include your Vercel URL:
```javascript
// In client-api/app.js
app.use(cors({ 
  origin: [
    process.env.FRONTEND_URL || "*",
    "https://your-project-name.vercel.app"  // Add your Vercel URL
  ], 
  credentials: true 
}));
```

## Post-Deployment Checklist

- [ ] Verify the site loads correctly
- [ ] Test API connections
- [ ] Update backend CORS settings with Vercel URL
- [ ] Test authentication flows
- [ ] Set up custom domain (optional)
- [ ] Configure environment variables in Vercel dashboard

## Troubleshooting

### Build Fails
- Check Node.js version (Vercel uses Node 18+ by default)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### API Connection Issues
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend CORS settings
- Ensure backend is running and accessible

### Routing Issues
- The `vercel.json` includes rewrites for SPA routing
- All routes should redirect to `index.html`

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- Check build logs in Vercel dashboard for specific errors


