const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');

const addon = path.join(__dirname, '..', 'node_modules', 'better-sqlite3', 'build', 'Release', 'better_sqlite3.node');
if (fs.existsSync(addon)) process.exit(0);

let version = '11.7.0';
try {
  version = require('better-sqlite3/package.json').version;
} catch {
  process.exit(0);
}

const abi = process.versions.modules;
const url = `https://github.com/WiseLibs/better-sqlite3/releases/download/v${version}/better-sqlite3-v${version}-node-v${abi}-${process.platform}-${process.arch}.tar.gz`;
const dest = path.join(require('os').tmpdir(), `better-sqlite3-${version}.tar.gz`);
const pkgRoot = path.join(__dirname, '..', 'node_modules', 'better-sqlite3');

function download(src, file) {
  return new Promise((resolve, reject) => {
    const req = https.get(src, { headers: { 'User-Agent': 'ng-idps-cti-feed' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, file).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: ${res.statusCode} ${src}`));
        return;
      }
      const stream = fs.createWriteStream(file);
      res.pipe(stream);
      stream.on('finish', () => stream.close(resolve));
    });
    req.on('error', reject);
  });
}

download(url, dest)
  .then(() => {
    execSync(`tar -xzf "${dest}" -C "${pkgRoot}"`, { stdio: 'inherit' });
    if (!fs.existsSync(addon)) throw new Error('Native addon still missing after extract');
  })
  .catch((err) => {
    console.warn('[ensure-better-sqlite3]', err.message);
    process.exit(0);
  });
