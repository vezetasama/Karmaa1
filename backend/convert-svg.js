const sharp = require('sharp');
const path = require('path');

async function convertSvg() {
  const svgPath = path.join(__dirname, '..', 'frontend', 'public', 'images', 'topup-mlbb.svg');
  const outputPath = path.join(__dirname, '..', 'frontend', 'public', 'images', 'topup-mlbb.png');

  await sharp(svgPath)
    .resize(300, 400)
    .png()
    .toFile(outputPath);

  console.log('✅ Converted SVG to PNG');
}

convertSvg().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
