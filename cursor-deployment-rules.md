# Cursor Deployment Rules for GitHub Actions

## Workflow Patterns from `.github/workflows/deploy.yml`

### Standard Workflow Structure
```yaml
name: Deploy from Cursor

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
      - name: Setup Node.js
      - name: Install dependencies
      - name: Validate code
      - name: Deploy
```

## Code Validation Patterns

### JavaScript Validation
```bash
# Syntax checking
find . -name "*.js" -exec node -c {} \;

# Console.log detection
if grep -r "console\.log" . --exclude-dir=node_modules --exclude-dir=.git; then
  echo "⚠️  Warning: console.log statements found in code"
fi
```

### HTML Validation
```bash
# HTML file validation
find . -name "*.html" -exec echo "Validating {}" \;
```

### Security Scanning
```bash
# Sensitive data detection
if grep -r "password\|secret\|key\|token" . --exclude-dir=node_modules --exclude-dir=.git; then
  echo "Warning: Potential sensitive data found in code"
  exit 1
fi
```

## Deployment Steps Template

### 1. Environment Setup
```yaml
- name: Checkout code
  uses: actions/checkout@v4

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

### 2. Dependencies
```yaml
- name: Install dependencies
  run: npm ci
```

### 3. Code Quality
```yaml
- name: Validate HTML
  run: |
    find . -name "*.html" -exec echo "Validating {}" \;

- name: Validate JavaScript
  run: |
    find . -name "*.js" -exec node -c {} \;

- name: Check for sensitive data
  run: |
    if grep -r "password\|secret\|key\|token" . --exclude-dir=node_modules --exclude-dir=.git; then
      echo "Warning: Potential sensitive data found in code"
      exit 1
    fi
```

### 4. Reporting
```yaml
- name: Create deployment summary
  run: |
    echo "## Deployment Summary" >> $GITHUB_STEP_SUMMARY
    echo "- **Repository:** ${{ github.repository }}" >> $GITHUB_STEP_SUMMARY
    echo "- **Branch:** ${{ github.ref_name }}" >> $GITHUB_STEP_SUMMARY
    echo "- **Commit:** ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
    echo "- **Author:** ${{ github.actor }}" >> $GITHUB_STEP_SUMMARY
```

### 5. Deployment
```yaml
- name: Deploy to GitHub Pages
  if: github.ref == 'refs/heads/main'
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./audit-website
    publish_branch: gh-pages
```

## Quality Checks

### File Size Monitoring
```bash
# Check for large files
find . -name "*.js" -o -name "*.html" -o -name "*.css" | while read file; do
  size=$(wc -c < "$file")
  if [ $size -gt 100000 ]; then
    echo "⚠️  Large file detected: $file ($size bytes)"
  fi
done
```

### Code Quality Metrics
- JavaScript syntax validation
- HTML structure validation
- Security vulnerability scanning
- Performance optimization checks

## Error Handling Patterns

### Try-Catch in JavaScript
```javascript
try {
  const result = await App.getVariable('auditData');
  // Process result
} catch (e) {
  console.log("Error getting variable:", e);
  // Fallback logic
}
```

### Workflow Error Handling
```yaml
- name: Handle errors
  run: |
    if [ "${{ job.status }}" == "success" ]; then
      echo "✅ Deployment successful!"
    else
      echo "❌ Deployment failed!"
      exit 1
    fi
```

## Security Guidelines

### Never Commit
- API keys or secrets
- Database credentials
- Private tokens
- Personal information
- Environment-specific configuration

### Use GitHub Secrets
```yaml
# Reference secrets in workflows
github_token: ${{ secrets.GITHUB_TOKEN }}
api_key: ${{ secrets.API_KEY }}
```

## Performance Optimization

### Workflow Optimization
- Cache dependencies
- Use parallel jobs
- Optimize step order
- Minimize build time

### Code Optimization
- Minimize bundle sizes
- Use efficient algorithms
- Optimize images and assets
- Implement lazy loading

## Monitoring and Reporting

### Deployment Metrics
- Track deployment frequency
- Monitor success rates
- Measure deployment times
- Analyze failure patterns

### Quality Metrics
- Code coverage
- Test results
- Security scan results
- Performance benchmarks

## Troubleshooting Guide

### Common Issues
1. **Authentication**: Complete browser authentication
2. **Permissions**: Check repository settings
3. **Syntax**: Validate code before pushing
4. **Dependencies**: Verify package.json

### Debug Steps
1. Check GitHub Actions logs
2. Verify workflow configuration
3. Test locally before pushing
4. Review error messages

## Best Practices

### Workflow Design
- Use reusable actions
- Implement proper error handling
- Add comprehensive logging
- Include rollback strategies

### Code Quality
- Follow coding standards
- Implement proper testing
- Use linting tools
- Maintain documentation

### Security
- Regular security audits
- Use least privilege access
- Implement proper access controls
- Monitor for vulnerabilities

## Future Enhancements

### Automation
- Auto-merge on success
- Automated testing
- Performance monitoring
- Security scanning

### Integration
- Slack notifications
- Email alerts
- Status badges
- Deployment tracking

---

**Based on**: `.github/workflows/deploy.yml`
**Repository**: https://github.com/patrick-finley-ui/CodingProjects
**Last Updated**: 2024-01-06 