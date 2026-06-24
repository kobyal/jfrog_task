# GitHub Actions Workflow Setup

This document explains how to configure the GitHub Actions workflow for building, scanning, and deploying to JFrog.

## Required GitHub Secrets

Before running the workflow, you need to configure the following secrets in your GitHub repository:

### JFrog Configuration Secrets

Go to **Settings > Secrets and variables > Actions** in your GitHub repository and add:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `JFROG_URL` | Your JFrog platform URL | `https://yourcompany.jfrog.io` |
| `JFROG_ACCESS_TOKEN` | JFrog access token for authentication | `eyJ2ZXIiOiIyIiwidHl...` |
| `JFROG_USERNAME` | JFrog username (for Docker login) | `your-username@company.com` |
| `JFROG_REGISTRY_URL` | Docker registry URL | `yourcompany.jfrog.io` |
| `JFROG_DOCKER_REPO` | Docker repository name in Artifactory | `docker-local` |

### How to Get JFrog Access Token

1. Log into your JFrog platform
2. Go to **User Profile > Generate Token**
3. Select appropriate scopes (Artifactory, Xray)
4. Copy the generated token
5. Add it as `JFROG_ACCESS_TOKEN` secret in GitHub

## Workflow Features

### 🎯 **Manual Trigger (On-Demand)**
- Triggered via GitHub Actions UI
- Customizable inputs:
  - **Environment**: Choose target environment (dev/staging/prod)
  - **Skip Tests**: Option to skip test execution
  - **Docker Tag**: Custom tag for Docker image

### 🔄 **Pipeline Stages**

1. **Setup** - Initialize variables and outputs
2. **Test** - Run linting and unit tests (optional)
3. **Build** - Build Node.js app and create npm package
4. **Docker Build** - Create and push Docker image
5. **Security Scan** - Scan with JFrog Xray
6. **Publish Build** - Publish build info to JFrog
7. **Notify** - Generate summary and deployment instructions

### 🛡️ **Security Features**

- **Vulnerability Scanning**: Docker image and npm packages
- **SBOM Generation**: Software Bill of Materials
- **Build Traceability**: Full build information in JFrog
- **Access Control**: Token-based authentication

## How to Run the Workflow

### Via GitHub UI

1. Go to **Actions** tab in your repository
2. Select **"Build, Scan & Deploy to JFrog"** workflow
3. Click **"Run workflow"**
4. Fill in the parameters:
   - **Environment**: Select target environment
   - **Skip tests**: Check if you want to skip tests
   - **Docker tag**: Enter custom tag (optional)
5. Click **"Run workflow"** button

### Expected Outputs

After successful execution, you'll have:

- ✅ **npm package** uploaded to JFrog Artifactory
- ✅ **Docker image** pushed to JFrog Docker repository
- ✅ **Security scan results** from JFrog Xray
- ✅ **Build information** published to JFrog
- ✅ **SBOM report** available as GitHub artifact

## Repository Requirements

### Required Repository Structure
```
├── .github/workflows/build-and-deploy.yml
├── src/
├── package.json
├── Dockerfile
└── README.md
```

### Required npm Scripts
The workflow expects these scripts in `package.json`:
- `npm run lint` - Code linting
- `npm test` - Run tests
- `npm run build` - Build application
- `npm pack` - Create package

## Troubleshooting

### Common Issues

**Authentication Failed**
- Verify `JFROG_ACCESS_TOKEN` is valid and has required permissions
- Check `JFROG_URL` format (should include protocol)

**Docker Push Failed**
- Ensure `JFROG_DOCKER_REPO` exists in your Artifactory
- Verify Docker repository permissions

**Build Info Not Published**
- Check JFrog CLI version compatibility
- Ensure build name/number are unique

**Scan Failures**
- Xray licensing and configuration
- Repository indexing settings in JFrog

### Support

For issues specific to:
- **JFrog CLI**: Check [JFrog CLI documentation](https://www.jfrog.com/confluence/display/CLI/JFrog+CLI)
- **GitHub Actions**: Check [GitHub Actions documentation](https://docs.github.com/en/actions)
- **Workflow syntax**: Validate YAML syntax

## Security Best Practices

✅ **Never commit secrets** to the repository  
✅ **Use least privilege** access tokens  
✅ **Rotate tokens** regularly  
✅ **Monitor workflow** execution logs  
✅ **Review scan results** before deployment  

## Example Workflow Run

A successful workflow run will show:
```
✅ Setup
✅ Test (or skipped)
✅ Build
✅ Docker Build
⚠️  Security Scan (may show vulnerabilities)
✅ Publish Build
✅ Notify
```

The notification step will provide a summary with deployment commands for easy reference. 