# Noteflow Android App - Build Instructions

## Overview
Noteflow is a notes and recurring tasks app. This guide explains how to build the Android APK using Codemagic.

## Prerequisites
- GitHub account
- Codemagic account (free tier available)

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Noteflow app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/noteflow.git
git push -u origin main
```

## Step 2: Set Up Codemagic

1. Go to [codemagic.io](https://codemagic.io)
2. Sign in with your GitHub account
3. Click "Add application"
4. Select your Noteflow repository
5. Choose "codemagic.yaml" as the configuration

## Step 3: Configure Build Settings

The `codemagic.yaml` file is already configured. It will:
- Install Node.js dependencies
- Build the web app
- Sync with Capacitor
- Build the Android APK

## Step 4: Start Build

1. In Codemagic dashboard, click "Start new build"
2. Select "android-workflow"
3. Click "Start build"

## Step 5: Download APK

Once the build completes:
1. Go to the build details
2. Download the APK from "Artifacts" section
3. Install on your Android device

## Important Notes

### API Configuration
The app needs to connect to your backend server. Before building:

1. Deploy your backend (you can use Replit Deployments)
2. Update `capacitor.config.ts` with your server URL:
```typescript
server: {
  url: 'https://your-deployed-app.replit.app',
  androidScheme: 'https',
}
```

### For Development
To test locally with the web version, the app runs at:
- Web: http://localhost:5000

## File Structure
```
├── android/          # Android native project
├── client/           # React frontend
├── server/           # Express backend
├── capacitor.config.ts
├── codemagic.yaml
└── package.json
```

## Troubleshooting

### Build fails on Codemagic
- Ensure all dependencies are in package.json
- Check that `npm run build` works locally

### App doesn't connect to API
- Verify the backend is deployed and accessible
- Update the server URL in capacitor.config.ts
- Run `npx cap sync android` after changes

## Support
For issues, check:
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Codemagic Docs](https://docs.codemagic.io/)
