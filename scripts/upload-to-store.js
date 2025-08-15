#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const webStore = require('chrome-webstore-upload');

// Configuration
const CONFIG = {
  extensionId: process.env.CHROME_EXTENSION_ID || '',
  clientId: process.env.CHROME_CLIENT_ID || '',
  clientSecret: process.env.CHROME_CLIENT_SECRET || '',
  refreshToken: process.env.CHROME_REFRESH_TOKEN || ''
};

const BUILD_DIR = path.join(__dirname, '..', 'build');
const PACKAGE_NAME = 'flutter-widget-catcher-extension.zip';

/**
 * Upload extension to Chrome Web Store
 */
async function uploadToStore() {
  console.log('🚀 Uploading to Chrome Web Store...');
  
  try {
    // Validate configuration
    validateConfig();
    
    // Check if package exists
    const packagePath = path.join(BUILD_DIR, PACKAGE_NAME);
    if (!fs.existsSync(packagePath)) {
      throw new Error(`Package not found: ${packagePath}. Please run npm run package first.`);
    }
    
    console.log(`📦 Package found: ${packagePath}`);
    
    // Initialize Chrome Web Store API
    const store = webStore(CONFIG);
    
    // Upload the extension
    console.log('📤 Uploading extension...');
    const zipFile = fs.createReadStream(packagePath);
    
    const uploadResult = await store.uploadExisting(zipFile);
    console.log('✅ Upload successful!');
    console.log('Upload result:', uploadResult);
    
    // Publish the extension
    if (process.env.AUTO_PUBLISH === 'true') {
      console.log('📢 Publishing extension...');
      const publishResult = await store.publish();
      console.log('✅ Publish successful!');
      console.log('Publish result:', publishResult);
    } else {
      console.log('ℹ️  Extension uploaded but not published. Set AUTO_PUBLISH=true to auto-publish.');
    }
    
    console.log('🎉 Process completed successfully!');
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    
    if (error.message.includes('401')) {
      console.error('💡 Hint: Check your authentication credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)');
    } else if (error.message.includes('404')) {
      console.error('💡 Hint: Check your CHROME_EXTENSION_ID');
    }
    
    process.exit(1);
  }
}

/**
 * Validate required configuration
 */
function validateConfig() {
  const missingVars = [];
  
  if (!CONFIG.extensionId) missingVars.push('CHROME_EXTENSION_ID');
  if (!CONFIG.clientId) missingVars.push('CHROME_CLIENT_ID');
  if (!CONFIG.clientSecret) missingVars.push('CHROME_CLIENT_SECRET');
  if (!CONFIG.refreshToken) missingVars.push('CHROME_REFRESH_TOKEN');
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('');
    console.error('💡 Please set these environment variables or create a .env file');
    console.error('   See README.md for setup instructions');
    throw new Error('Missing environment variables');
  }
  
  console.log('✅ Configuration validated');
}

/**
 * Generate refresh token helper
 */
function generateRefreshTokenHelper() {
  console.log('🔑 To generate a refresh token:');
  console.log('');
  console.log('1. Go to https://console.developers.google.com/');
  console.log('2. Create or select a project');
  console.log('3. Enable Chrome Web Store API');
  console.log('4. Create OAuth 2.0 credentials (Desktop application)');
  console.log('5. Use this URL to get authorization code:');
  console.log(`   https://accounts.google.com/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=${CONFIG.clientId}&redirect_uri=urn:ietf:wg:oauth:2.0:oob`);
  console.log('6. Exchange authorization code for refresh token');
  console.log('');
}

// Main execution
if (require.main === module) {
  console.log('🏪 Chrome Web Store Publisher');
  console.log('============================');
  
  // Check if help is requested
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Usage: node upload-to-store.js [options]');
    console.log('');
    console.log('Environment Variables:');
    console.log('  CHROME_EXTENSION_ID   - Your Chrome extension ID');
    console.log('  CHROME_CLIENT_ID      - OAuth client ID');
    console.log('  CHROME_CLIENT_SECRET  - OAuth client secret');
    console.log('  CHROME_REFRESH_TOKEN  - OAuth refresh token');
    console.log('  AUTO_PUBLISH          - Set to "true" to auto-publish');
    console.log('');
    console.log('Options:');
    console.log('  --help, -h            - Show this help');
    console.log('  --token-help          - Show refresh token generation help');
    process.exit(0);
  }
  
  if (process.argv.includes('--token-help')) {
    generateRefreshTokenHelper();
    process.exit(0);
  }
  
  uploadToStore();
} 