// Repository Encryption Engine (AES-256-GCM)
// Protects proprietary extension source code on public GitHub repositories
// Strictly zero emojis used anywhere.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MAGIC_HEADER = Buffer.from('SYNAPSE\x01', 'binary'); // 8 bytes identifier
const DEFAULT_KEY_PATH = path.resolve(__dirname, '..', '..', 'synapse21-secret.key');

// Protected files and directories
const PROTECTED_TARGETS = [
  'background.js',
  'manifest.json',
  'content',
  'dashboard',
  'popup',
  'blocked',
  'reflection',
  'shared',
  'icons'
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) {
    arrayOfFiles.push(dirPath);
    return arrayOfFiles;
  }
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

function getProtectedFileList() {
  const rootDir = path.resolve(__dirname, '..');
  let filesToProcess = [];
  PROTECTED_TARGETS.forEach(target => {
    const full = path.join(rootDir, target);
    if (fs.existsSync(full)) {
      filesToProcess = getAllFiles(full, filesToProcess);
    }
  });
  return filesToProcess;
}

function getKey(customPath = null) {
  const keyPath = customPath ? path.resolve(customPath) : DEFAULT_KEY_PATH;
  if (!fs.existsSync(keyPath)) {
    return null;
  }
  return fs.readFileSync(keyPath);
}

function isEncrypted(buffer) {
  if (buffer.length < MAGIC_HEADER.length + 28) return false;
  return buffer.subarray(0, MAGIC_HEADER.length).equals(MAGIC_HEADER);
}

// Commands
const command = (process.argv[2] || 'status').toLowerCase();
const argKey = process.argv[3] || null;

if (command === 'init') {
  const keyPath = argKey ? path.resolve(argKey) : DEFAULT_KEY_PATH;
  if (fs.existsSync(keyPath)) {
    console.log(`[INFO] Key already exists at: ${keyPath}`);
  } else {
    const key = crypto.randomBytes(32); // 256 bits
    fs.writeFileSync(keyPath, key);
    console.log(`[OK] AES-256 Secret Key generated at: ${keyPath}`);
    console.log(`[IMPORTANT] Keep this file safe outside the repository. Never share or commit it.`);
  }
  process.exit(0);
}

if (command === 'status') {
  const files = getProtectedFileList();
  const rootDir = path.resolve(__dirname, '..');
  let lockedCount = 0;
  let unlockedCount = 0;

  console.log('// SYNAPSE21 VAULT: ENCRYPTION STATUS REPORT');
  console.log('---------------------------------------------');
  files.forEach(f => {
    const rel = path.relative(rootDir, f);
    const content = fs.readFileSync(f);
    if (isEncrypted(content)) {
      lockedCount++;
      console.log(`[LOCKED]   ${rel}`);
    } else {
      unlockedCount++;
      console.log(`[UNLOCKED] ${rel}`);
    }
  });
  console.log('---------------------------------------------');
  console.log(`Total Files: ${files.length} | Locked: ${lockedCount} | Unlocked: ${unlockedCount}`);
  if (lockedCount === 0) {
    console.log('Status: Working Tree is PLAINTEXT (Ready for local extension development).');
  } else if (unlockedCount === 0) {
    console.log('Status: Working Tree is FULLY ENCRYPTED (Ready for safe public GitHub push).');
  } else {
    console.log('Status: PARTIAL ENCRYPTION detected.');
  }
  process.exit(0);
}

if (command === 'lock') {
  const key = getKey(argKey);
  if (!key) {
    console.error(`[ERROR] Secret key not found at: ${DEFAULT_KEY_PATH}`);
    console.error(`Run 'node scripts/vault.js init' first to generate your 256-bit key.`);
    process.exit(1);
  }

  const files = getProtectedFileList();
  const rootDir = path.resolve(__dirname, '..');
  let encryptedCount = 0;

  console.log('// SYNAPSE21 VAULT: ENCRYPTING SOURCE CODE (AES-256-GCM)');
  console.log('---------------------------------------------------------');

  files.forEach(f => {
    const rel = path.relative(rootDir, f);
    const content = fs.readFileSync(f);
    if (isEncrypted(content)) {
      console.log(`[ALREADY LOCKED] ${rel}`);
      return;
    }

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encryptedData = Buffer.concat([cipher.update(content), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const packed = Buffer.concat([MAGIC_HEADER, iv, authTag, encryptedData]);
    fs.writeFileSync(f, packed);
    encryptedCount++;
    console.log(`[ENCRYPTED]      ${rel}`);
  });

  console.log('---------------------------------------------------------');
  console.log(`[OK] Successfully encrypted ${encryptedCount} files.`);
  console.log(`Repository is now locked. It is 100% safe to commit and push to public GitHub.`);
  process.exit(0);
}

if (command === 'unlock') {
  const key = getKey(argKey);
  if (!key) {
    console.error(`[ERROR] Secret key not found at: ${DEFAULT_KEY_PATH}`);
    console.error(`Specify key path: node scripts/vault.js unlock <path-to-key>`);
    process.exit(1);
  }

  const files = getProtectedFileList();
  const rootDir = path.resolve(__dirname, '..');
  let decryptedCount = 0;

  console.log('// SYNAPSE21 VAULT: DECRYPTING SOURCE CODE (AES-256-GCM)');
  console.log('---------------------------------------------------------');

  files.forEach(f => {
    const rel = path.relative(rootDir, f);
    const content = fs.readFileSync(f);
    if (!isEncrypted(content)) {
      console.log(`[ALREADY UNLOCKED] ${rel}`);
      return;
    }

    const iv = content.subarray(MAGIC_HEADER.length, MAGIC_HEADER.length + 12);
    const authTag = content.subarray(MAGIC_HEADER.length + 12, MAGIC_HEADER.length + 28);
    const ciphertext = content.subarray(MAGIC_HEADER.length + 28);

    try {
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
      fs.writeFileSync(f, decrypted);
      decryptedCount++;
      console.log(`[DECRYPTED]        ${rel}`);
    } catch (err) {
      console.error(`[FAIL] Authentication failed for: ${rel}. Invalid key or corrupted file.`);
    }
  });

  console.log('---------------------------------------------------------');
  console.log(`[OK] Successfully decrypted ${decryptedCount} files.`);
  console.log(`Extension is now plaintext and ready for local development in Chrome.`);
  process.exit(0);
}

console.log('Usage: node scripts/vault.js [init | lock | unlock | status]');

