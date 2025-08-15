#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const BUILD_DIR = path.join(__dirname, '..', 'build');
const PACKAGE_NAME = 'flutter-widget-catcher-extension.zip';

/**
 * Create the extension package
 */
async function createPackage() {
  console.log('🚀 Creating extension package...');
  
  try {
    // Ensure build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
      fs.mkdirSync(BUILD_DIR, { recursive: true });
    }
    
    // Check if dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      console.error('❌ Dist directory not found. Please run npm run build first.');
      process.exit(1);
    }
    
    const packagePath = path.join(BUILD_DIR, PACKAGE_NAME);
    
    // Create zip archive
    const output = fs.createWriteStream(packagePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    output.on('close', function() {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ Package created successfully!`);
      console.log(`📦 File: ${packagePath}`);
      console.log(`📏 Size: ${sizeMB} MB`);
      console.log(`📁 Total files: ${archive.pointer()} bytes`);
    });
    
    archive.on('error', function(err) {
      throw err;
    });
    
    archive.pipe(output);
    
    // Add all files from dist directory
    archive.directory(DIST_DIR, false);
    
    // Finalize the archive
    await archive.finalize();
    
    console.log('📋 Package contents:');
    listDirectoryContents(DIST_DIR, '  ');
    
  } catch (error) {
    console.error('❌ Error creating package:', error.message);
    process.exit(1);
  }
}

/**
 * List directory contents recursively
 * @param {string} dir - Directory path
 * @param {string} prefix - Prefix for indentation
 */
function listDirectoryContents(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      console.log(`${prefix}📁 ${item}/`);
      listDirectoryContents(itemPath, prefix + '  ');
    } else {
      const sizeMB = (stats.size / 1024).toFixed(1);
      console.log(`${prefix}📄 ${item} (${sizeMB} KB)`);
    }
  });
}

/**
 * Validate manifest.json
 */
function validateManifest() {
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    throw new Error('manifest.json not found in dist directory');
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Validate required fields
  const requiredFields = ['name', 'version', 'description', 'manifest_version'];
  const missingFields = requiredFields.filter(field => !manifest[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required manifest fields: ${missingFields.join(', ')}`);
  }
  
  console.log(`✅ Manifest validation passed`);
  console.log(`   Name: ${manifest.name}`);
  console.log(`   Version: ${manifest.version}`);
  console.log(`   Manifest Version: ${manifest.manifest_version}`);
  
  return manifest;
}

// Main execution
if (require.main === module) {
  console.log('📦 Flutter Widget Catcher - Package Builder');
  console.log('==========================================');
  
  try {
    validateManifest();
    createPackage();
  } catch (error) {
    console.error('❌ Packaging failed:', error.message);
    process.exit(1);
  }
} 