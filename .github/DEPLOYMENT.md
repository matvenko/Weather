# FTP Deployment Setup

This repository is configured to automatically deploy to an FTP server when code is pushed to the `main` branch.

## Required GitHub Secrets

To enable automatic deployment, you need to configure the following secrets in your GitHub repository:

### How to Add Secrets:
1. Go to your GitHub repository
2. Click on **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Required Secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `FTP_SERVER` | FTP server address (without ftp://) | `ftp.yourserver.com` or `192.168.1.100` |
| `FTP_USERNAME` | FTP username | `your_ftp_username` |
| `FTP_PASSWORD` | FTP password | `your_ftp_password` |
| `VITE_API_URL` | API URL for production (optional) | `https://weather-api.webmania.ge` |

### Server Directory Configuration

If your FTP server requires files to be uploaded to a specific directory (e.g., `public_html`, `www`, `httpdocs`), edit the `.github/workflows/deploy.yml` file and change:

```yaml
server-dir: ./public_html/  # Change this to your target directory
```

Current setting: `server-dir: ./` (uploads to root directory)

## Workflow Behavior

- **Trigger**: Automatically runs on every push to `main` branch
- **Build**: Runs `npm ci` and `npm run build`
- **Deploy**: Uploads contents of `./dist/` folder to FTP server
- **Safety**: `dangerous-clean-slate: false` - does not delete existing files, only updates/adds

## Manual Deployment

If you need to manually trigger a deployment:
1. Go to **Actions** tab in GitHub
2. Select **Build and Deploy to FTP** workflow
3. Click **Run workflow**

## Troubleshooting

### Build Fails
- Check if all dependencies are in `package.json`
- Verify `npm run build` works locally

### Deployment Fails
- Verify FTP credentials are correct
- Check server firewall allows GitHub IPs
- Ensure `server-dir` path is correct

### Files Not Updating
- Check FTP server file permissions
- Verify the deployment is uploading to the correct directory