#!/bin/bash
# SFTP Deployment Script for OVH Hosting
# Usage: ./deploy-sftp.sh <local_path> <remote_path>
#
# Required environment variables:
#   OVH_SFTP_HOST - SFTP server hostname
#   OVH_SFTP_PORT - SFTP port (default: 22)
#   OVH_SFTP_USER - SFTP username
#   OVH_SFTP_PASSWORD - SFTP password
#
# Example:
#   ./deploy-sftp.sh ./dist/apps/koalka/landing/browser /home/koalkar/www

set -e

LOCAL_PATH="${1:?Error: Local path required}"
REMOTE_PATH="${2:?Error: Remote path required}"

# Load .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Validate required env vars
: "${OVH_SFTP_HOST:?Error: OVH_SFTP_HOST not set}"
: "${OVH_SFTP_USER:?Error: OVH_SFTP_USER not set}"
: "${OVH_SFTP_PASSWORD:?Error: OVH_SFTP_PASSWORD not set}"

OVH_SFTP_PORT="${OVH_SFTP_PORT:-22}"

echo "Deploying to ${OVH_SFTP_HOST}:${REMOTE_PATH}"
echo "Local path: ${LOCAL_PATH}"

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
  echo "Error: lftp is not installed. Install it with: brew install lftp"
  exit 1
fi

# Deploy using lftp mirror (uploads new/changed files, deletes removed files)
lftp -c "
set sftp:auto-confirm yes
set ssl:verify-certificate no
open -u ${OVH_SFTP_USER},${OVH_SFTP_PASSWORD} sftp://${OVH_SFTP_HOST}:${OVH_SFTP_PORT}
mirror --reverse --delete --verbose --parallel=4 ${LOCAL_PATH} ${REMOTE_PATH}
bye
"

echo "Deployment complete!"
