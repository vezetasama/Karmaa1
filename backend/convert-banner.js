const sharp = require('sharp');
const path = require('path');

async function convertBanner() {
  const svgPath = path.join(__dirname, '..', 'frontend', 'public', 'images', 'banner-mlbb.svg');
  const outputPath = path.join(__dirname, '..', 'frontend', 'public', 'images', 'banner-mlbb.png');

  await sharp(svgPath)
    .resize(1200, 400)
    .png()
    .toFile(outputPath);

  console.log('✅ Converted banner SVG to PNG');
}

convertBanner().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
