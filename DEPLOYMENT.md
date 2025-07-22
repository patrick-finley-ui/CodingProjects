# Cursor to GitHub Deployment Guide

This repository is configured with automatic deployment from Cursor IDE to GitHub using GitHub Actions.

## 🚀 How It Works

### Automatic Deployment
- **Trigger**: Any push to the `main` branch (from Cursor or any other source)
- **Workflow**: `.github/workflows/cursor-deploy.yml`
- **Deployment**: Automatic deployment to GitHub Pages

### Manual Deployment
- Go to GitHub repository → Actions → "Cursor Auto-Deploy" → Run workflow

## 📋 What Gets Deployed

### Files Included
- `audit-website/` - Main application files
  - `index.html` - Main HTML file
  - `script.js` - JavaScript with UiPath integration
  - `styles.css` - Styling
  - `README.md` - Documentation

### Files Excluded
- `node_modules/` - Dependencies (installed during deployment)
- `.git/` - Git metadata
- IDE-specific files (`.vscode/`, `.cursor/`, etc.)
- OS-specific files (`.DS_Store`, `Thumbs.db`, etc.)

## 🔧 Deployment Process

1. **Code Validation**
   - Syntax checking for JavaScript files
   - HTML validation
   - Code quality checks

2. **Dependency Management**
   - Installs Node.js dependencies
   - Runs tests (if configured)

3. **Quality Checks**
   - Checks for console.log statements
   - Validates file sizes
   - Security scanning

4. **Deployment**
   - Deploys to GitHub Pages
   - Creates deployment summary
   - Sends notifications

## 🌐 Live URLs

- **GitHub Pages**: `https://patrick-finley-ui.github.io/CodingProjects/`
- **Repository**: `https://github.com/patrick-finley-ui/CodingProjects`

## 📊 Monitoring

### GitHub Actions Dashboard
- View deployment status: `https://github.com/patrick-finley-ui/CodingProjects/actions`
- Check workflow runs and logs
- Monitor deployment history

### Deployment Reports
Each deployment includes:
- Files changed
- Deployment timestamp
- Author information
- Quality check results

## 🛠️ Customization

### Adding Tests
Create a `package.json` with test scripts:
```json
{
  "scripts": {
    "test": "your-test-command"
  }
}
```

### Modifying Deployment
Edit `.github/workflows/cursor-deploy.yml` to:
- Change deployment conditions
- Add custom validation steps
- Modify deployment targets

### Environment Variables
Add secrets in GitHub repository settings:
- Go to Settings → Secrets and variables → Actions
- Add any required environment variables

## 🔒 Security

### What's Protected
- No sensitive data in code (checked automatically)
- Secure token handling
- Environment variable protection

### Best Practices
- Never commit API keys or passwords
- Use GitHub secrets for sensitive data
- Review code before pushing

## 📝 Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check GitHub Actions logs
   - Verify code syntax
   - Ensure all dependencies are in package.json

2. **Files Not Deployed**
   - Check .gitignore settings
   - Verify file paths
   - Ensure files are committed

3. **GitHub Pages Not Updating**
   - Check gh-pages branch
   - Verify repository settings
   - Wait for deployment completion

### Getting Help
- Check GitHub Actions logs for detailed error messages
- Review the workflow file for configuration issues
- Contact repository maintainer for access issues

## 🎯 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/patrick-finley-ui/CodingProjects.git
   ```

2. **Make changes in Cursor**
   - Edit files as needed
   - Save changes

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

4. **Monitor deployment**
   - Check GitHub Actions tab
   - Wait for deployment completion
   - Visit live URL

## 📈 Performance

### Optimization
- Minified assets in production
- Optimized images
- Efficient code structure

### Monitoring
- GitHub Pages analytics
- Performance metrics
- Error tracking

---

**Last Updated**: $(date)
**Version**: 1.0.0 