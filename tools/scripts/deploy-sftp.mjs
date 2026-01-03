#!/usr/bin/env node
/**
 * SFTP Deployment Script
 *
 * Usage: node tools/scripts/deploy-sftp.mjs <ENV_PREFIX> <LOCAL_PATH>
 *
 * Arguments:
 *   ENV_PREFIX  - Environment variable prefix (e.g., KOALKA_LANDING)
 *   LOCAL_PATH  - Local directory to upload
 *
 * Required environment variables (using prefix):
 *   {PREFIX}_SFTP_HOST        - SFTP server hostname
 *   {PREFIX}_SFTP_PORT        - SFTP port (default: 22)
 *   {PREFIX}_SFTP_USER        - SFTP username
 *   {PREFIX}_SFTP_PASSWORD    - SFTP password
 *   {PREFIX}_SFTP_REMOTE_PATH - Remote directory path
 *
 * Example:
 *   node tools/scripts/deploy-sftp.mjs KOALKA_LANDING ./dist/apps/koalka/landing/browser
 */

import SftpClient from 'ssh2-sftp-client';
import { config } from 'dotenv';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, basename, relative } from 'path';

// Load .env file
config();

const [, , envPrefix, localPath] = process.argv;

if (!envPrefix || !localPath) {
  console.error('Usage: node deploy-sftp.mjs <ENV_PREFIX> <LOCAL_PATH>');
  console.error('Example: node deploy-sftp.mjs KOALKA_LANDING ./dist/apps/koalka/landing/browser');
  process.exit(1);
}

// Get config from environment variables
const getEnv = (suffix, required = true) => {
  const key = `${envPrefix}_SFTP_${suffix}`;
  const value = process.env[key];
  if (required && !value) {
    console.error(`Error: Environment variable ${key} is not set`);
    process.exit(1);
  }
  return value;
};

const config_sftp = {
  host: getEnv('HOST'),
  port: parseInt(getEnv('PORT', false) || '22', 10),
  username: getEnv('USER'),
  password: getEnv('PASSWORD'),
};

const remotePath = getEnv('REMOTE_PATH').replace(/\/+$/, ''); // Remove trailing slashes

// Verify local path exists
if (!existsSync(localPath)) {
  console.error(`Error: Local path does not exist: ${localPath}`);
  console.error('Did you run the build first? Try: npx nx build <project>');
  process.exit(1);
}

console.log('========================================');
console.log('SFTP Deployment');
console.log('========================================');
console.log(`Host: ${config_sftp.host}:${config_sftp.port}`);
console.log(`User: ${config_sftp.username}`);
console.log(`Remote: ${remotePath}`);
console.log(`Local: ${localPath}`);
console.log('========================================');

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

/**
 * Main deployment function
 */
async function deploy() {
  const sftp = new SftpClient();

  try {
    console.log('\nConnecting to SFTP server...');
    await sftp.connect(config_sftp);
    console.log('Connected successfully!\n');

    // Ensure remote base directory exists
    try {
      await sftp.mkdir(remotePath, true);
      console.log(`Ensured remote directory exists: ${remotePath}`);
    } catch (e) {
      // Directory might already exist, that's fine
    }

    // Get all local files
    const localFiles = getAllFiles(localPath);
    console.log(`Found ${localFiles.length} files to upload\n`);

    // Create remote directories and upload files
    const uploadedDirs = new Set();
    uploadedDirs.add(remotePath); // Base path already ensured above

    for (const localFile of localFiles) {
      const relativePath = relative(localPath, localFile);

      // Construct remote paths using forward slashes (POSIX) and normalize
      const remoteFile = `${remotePath}/${relativePath}`.replace(/\\/g, '/').replace(/\/+/g, '/');
      const relativeDir = relative(localPath, join(localFile, '..'));
      const remoteDir = relativeDir === '.' || relativeDir === ''
        ? remotePath
        : `${remotePath}/${relativeDir}`.replace(/\\/g, '/').replace(/\/+/g, '/');

      // Create remote directory if needed
      if (!uploadedDirs.has(remoteDir)) {
        try {
          await sftp.mkdir(remoteDir, true);
          uploadedDirs.add(remoteDir);
        } catch (e) {
          // Only ignore "already exists" errors
          if (!e.message.includes('already exists') &&
              !e.message.includes('EEXIST') &&
              !e.message.includes('File exists')) {
            console.error(`\nWarning: Failed to create directory ${remoteDir}: ${e.message}`);
          }
          uploadedDirs.add(remoteDir); // Mark as processed to avoid retry
        }
      }

      // Upload file
      process.stdout.write(`Uploading: ${relativePath}... `);
      try {
        await sftp.put(localFile, remoteFile);
        console.log('OK');
      } catch (err) {
        console.error(`FAILED`);
        console.error(`  Error uploading ${relativePath}:`);
        console.error(`  Local:  ${localFile}`);
        console.error(`  Remote: ${remoteFile}`);
        console.error(`  Message: ${err.message}`);
        throw err;
      }
    }

    console.log('\n========================================');
    console.log('Deployment complete!');
    console.log('========================================');
  } catch (err) {
    console.error('\nDeployment failed:', err.message);
    process.exit(1);
  } finally {
    await sftp.end();
  }
}

deploy();
