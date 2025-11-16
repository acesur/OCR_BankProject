# Angular Fraud Detection System - Setup Instructions

## 🛠️ Complete Installation Guide

### Prerequisites Check
Before starting, verify you have the required software:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version

# If not installed, download from: https://nodejs.org/
```

### Step 1: Install Angular CLI
```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Verify installation
ng version
```

### Step 2: Project Setup

#### Option A: Use Existing Files (Recommended)
Since all the files are already created in your directory, you can directly install and run:

```bash
# Navigate to your project directory
cd /mnt/c/Users/LegendChaudhary/OneDrive\ -\ Dogma\ Group\ Ltd,\ GB,\ LONDON/Documents/ANN

# Install all dependencies
npm install

# Start the development server
ng serve

# Open browser to: http://localhost:4200
```

#### Option B: Create Fresh Project
If you want to start fresh with Angular CLI:

```bash
# Create new Angular project
ng new fraud-detection-system --routing --style=scss --skip-git

# Navigate to project directory
cd fraud-detection-system

# Add Angular Material
ng add @angular/material

# Install additional dependencies
npm install chart.js ng2-charts

# Then copy all the source files from the existing project
```

### Step 3: Development Server
```bash
# Start development server with live reload
ng serve

# Or specify port
ng serve --port 4200

# For network access
ng serve --host 0.0.0.0
```

### Step 4: Build for Production
```bash
# Build for production
ng build --configuration production

# Build output will be in dist/ folder
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Permission Issues (Windows)
```bash
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. Node Version Issues
```bash
# Check and update Node.js
npm install -g npm@latest
```

#### 3. Angular CLI Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall Angular CLI
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
```

#### 4. Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Required Dependencies

Your package.json should include these key dependencies:

### Production Dependencies
```json
{
  "@angular/animations": "^17.0.0",
  "@angular/cdk": "^17.0.0",
  "@angular/common": "^17.0.0",
  "@angular/compiler": "^17.0.0",
  "@angular/core": "^17.0.0",
  "@angular/forms": "^17.0.0",
  "@angular/material": "^17.0.0",
  "@angular/platform-browser": "^17.0.0",
  "@angular/platform-browser-dynamic": "^17.0.0",
  "@angular/router": "^17.0.0",
  "rxjs": "^7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "^0.14.0"
}
```

### Development Dependencies
```json
{
  "@angular-devkit/build-angular": "^17.0.0",
  "@angular/cli": "^17.0.0",
  "@angular/compiler-cli": "^17.0.0",
  "typescript": "^5.2.0"
}
```

## 🎯 Demo Credentials

Once the application is running, use these credentials to test:

| Role | Username | Password | Features |
|------|----------|----------|----------|
| **Police** | `police1` | `pass123` | File reports, OCR, ANN analysis |
| **Admin** | `admin1` | `pass123` | Review reports, manage system |
| **Bank** | `bank1` | `pass123` | Handle freeze requests |

## 🔍 Verification Steps

### 1. Check Application Status
```bash
# After ng serve, you should see:
✔ Browser application bundle generation complete.
✔ Built at: 2024-01-16T10:00:00.000Z
Local:   http://localhost:4200/
```

### 2. Test Application Features
- [ ] Login page loads correctly
- [ ] Authentication works with demo credentials
- [ ] Role-based navigation appears
- [ ] Dashboard displays statistics
- [ ] New report form works (Police role)
- [ ] OCR simulation functions
- [ ] ANN risk assessment displays

## 📱 Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

## 🚀 Deployment Options

### Local Development
```bash
ng serve --configuration development
```

### Production Build
```bash
ng build --configuration production
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/fraud-detection-system /usr/share/nginx/html
```

## 📞 Support

If you encounter issues:

1. **Check the console** in browser developer tools
2. **Verify all files** are in correct locations
3. **Check Angular CLI version** compatibility
4. **Clear npm cache** and reinstall dependencies
5. **Review terminal output** for specific error messages

## 🎉 Success Checklist

- [ ] Node.js 18+ installed
- [ ] Angular CLI installed globally
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server running (`ng serve`)
- [ ] Application accessible at http://localhost:4200
- [ ] Login functionality working
- [ ] All three user roles accessible
- [ ] OCR and ANN features demonstrable

## Next Steps

Once the application is running successfully:

1. **Explore the UI** with different user roles
2. **Test OCR functionality** by uploading mock documents
3. **Review the code structure** in `src/app/`
4. **Customize the styling** in SCSS files
5. **Add real API integrations** as needed
6. **Deploy to production** environment

---

**Need Help?** Check the console output and error messages for specific guidance.