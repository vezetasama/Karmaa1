const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  try {
    // Download MLBB logo from seeklogo
    const logoUrl = 'https://images.seeklogo.com/logo-png/57/1/mobile-legend-bang-bang-logo-png_seeklogo-570112.png';
    const logoDest = path.join(__dirname, 'client', 'public', 'images', 'topup-mlbb.png');
    await download(logoUrl, logoDest);
    console.log('✅ Downloaded topup-mlbb.png');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
