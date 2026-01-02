# Koalka Deployment Guide

This guide covers deployment options for Koalka applications.

## Overview

| Application | Deployment Method | Target |
|-------------|-------------------|--------|
| `koalka-landing` | SFTP | OVH Web Hosting |

## Deployment Methods

### 1. Automatic (GitHub Actions)

The `koalka-landing` app is automatically deployed when changes are pushed to the `main` branch, **but only if the project is affected by the changes**.

**Workflow file:** `.github/workflows/deploy-koalka-landing.yml`

**Triggers:**
- Push to `main` branch
- Manual trigger via `workflow_dispatch`

**Process:**
1. Checkout repository
2. Install dependencies (`yarn install`)
3. **Derive Nx affected SHAs** using `nrwl/nx-set-shas@v4`
4. **Check if `koalka-landing` is affected** by comparing changes
5. If affected: Build app (`npx nx build koalka-landing --configuration=production`)
6. If affected: Deploy via SFTP to OVH
7. Write summary to GitHub Actions UI

**Nx Affected Benefits:**
- Skips unnecessary builds when unrelated code changes
- Faster CI runs for changes to other apps/libs
- Respects Nx dependency graph (rebuilds if dependencies change)

**Example scenarios:**
| Change | Will Deploy? |
|--------|--------------|
| Edit `apps/koalka/landing/src/*` | ✅ Yes |
| Edit shared lib used by koalka-landing | ✅ Yes |
| Edit `apps/faceless/web/src/*` | ❌ No |
| Edit unrelated lib | ❌ No |

### 2. Manual (GitHub UI)

You can manually trigger a deployment from GitHub Actions:

1. Go to **Actions** tab in GitHub
2. Select **Deploy Koalka Landing** workflow
3. Click **Run workflow** button
4. Select branch and click **Run workflow**

This bypasses the affected check and always deploys.

### 3. Manual (Local Machine)

Deploy directly from your local machine using the Nx deploy target.

```bash
# Build and deploy in one command
npx nx deploy koalka-landing
```

This command:
1. Builds the app (via `dependsOn: ["build"]`)
2. Uploads to OVH via SFTP

**Requirements:**
- Environment variables configured in `.env` (see below)

## Environment Variables

Add these to your `.env` file for local deployment:

```bash
# SFTP Deployment - Koalka Landing (OVH)
KOALKA_LANDING_SFTP_HOST=ftp.cluster121.hosting.ovh.net
KOALKA_LANDING_SFTP_PORT=22
KOALKA_LANDING_SFTP_USER=koalkar
KOALKA_LANDING_SFTP_PASSWORD=<your-password>
KOALKA_LANDING_SFTP_REMOTE_PATH=/home/koalkar/www
```

### Variable Naming Convention

For multiple apps, use the pattern: `{APP_NAME}_SFTP_{VARIABLE}`

| Variable | Description |
|----------|-------------|
| `*_SFTP_HOST` | SFTP server hostname |
| `*_SFTP_PORT` | SFTP port (default: 22) |
| `*_SFTP_USER` | SFTP username |
| `*_SFTP_PASSWORD` | SFTP password |
| `*_SFTP_REMOTE_PATH` | Remote directory path |

## GitHub Environment & Secrets

The workflow uses a **GitHub Environment** called `koalka` for deployment secrets.

### Setup

1. Go to repo **Settings → Environments → New environment**
2. Create environment named `koalka`
3. Add these secrets to the environment:

| Secret | Value |
|--------|-------|
| `PROD_HOST` | `ftp.cluster121.hosting.ovh.net` |
| `PROD_PORT` | `22` |
| `PROD_USER` | `koalkar` |
| `PROD_PASSWORD` | Your SFTP password |
| `PROD_REMOTE_PATH` | `/home/koalkar/www` |

### Why Use Environments?

- **Isolation**: Secrets scoped to specific environment
- **Protection rules**: Optional approval gates before deployment
- **Deployment tracking**: GitHub shows deployment history
- **Cleaner naming**: Simple `PROD_*` names in GitHub, mapped to `KOALKA_LANDING_*` for the script

### Local vs GitHub Variable Mapping

| Local `.env` | GitHub Environment Secret |
|--------------|---------------------------|
| `KOALKA_LANDING_SFTP_HOST` | `PROD_HOST` |
| `KOALKA_LANDING_SFTP_PORT` | `PROD_PORT` |
| `KOALKA_LANDING_SFTP_USER` | `PROD_USER` |
| `KOALKA_LANDING_SFTP_PASSWORD` | `PROD_PASSWORD` |
| `KOALKA_LANDING_SFTP_REMOTE_PATH` | `PROD_REMOTE_PATH` |

The workflow maps GitHub secrets to the script's expected format automatically.

## OVH Hosting Details

| Setting | Value |
|---------|-------|
| SFTP Server | `ftp.cluster121.hosting.ovh.net` |
| SFTP Port | 22 |
| FTP Port | 21 |
| Home Directory | `/home/koalkar` |
| Web Root | `/home/koalkar/www` |

## Adding Deploy Target to New Apps

To add SFTP deployment to another app:

### 1. Add environment variables to `.env`

```bash
# Example for a new app called "my-app"
MY_APP_SFTP_HOST=ftp.example.com
MY_APP_SFTP_PORT=22
MY_APP_SFTP_USER=username
MY_APP_SFTP_PASSWORD=password
MY_APP_SFTP_REMOTE_PATH=/var/www/my-app
```

### 2. Add deploy target to `project.json`

```json
{
  "targets": {
    "deploy": {
      "executor": "nx:run-commands",
      "dependsOn": ["build"],
      "options": {
        "command": "node tools/scripts/deploy-sftp.mjs MY_APP dist/apps/path/to/app/browser"
      }
    }
  }
}
```

### 3. Run deployment

```bash
npx nx deploy my-app
```

## Troubleshooting

### Connection Refused

- Verify SFTP host and port are correct
- Check if your IP is whitelisted (some hosts block unknown IPs)
- Ensure SFTP is enabled in OVH panel

### Permission Denied

- Verify username and password
- Check remote path permissions
- Ensure the user has write access to the remote directory

### Build Not Found

If deployment fails with "Local path does not exist":

```bash
# Build first, then deploy manually
npx nx build koalka-landing
node tools/scripts/deploy-sftp.mjs KOALKA_LANDING dist/apps/koalka/landing/browser
```

### Debug Mode

To see detailed output, run the script directly:

```bash
node tools/scripts/deploy-sftp.mjs KOALKA_LANDING dist/apps/koalka/landing/browser
```
