const sharp = require('sharp');
const path = require('path');

async function createMLBBImage() {
  const width = 300;
  const height = 400;
  const logoPath = path.join(__dirname, '..', 'frontend', 'public', 'images', 'topup-mlbb.png');
  const outputPath = path.join(__dirname, '..', 'frontend', 'public', 'images', 'topup-mlbb.png');

  // Create gradient background
  const background = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 10, g: 22, b: 40, alpha: 1 }
    }
  })
    .linear([0.5, 0.5, 0.5], [0, 0, 0]) // simple dark base
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Create a blue gradient overlay using SVG
  const gradientSvg = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0A1628"/>
          <stop offset="50%" stop-color="#0D3B66"/>
          <stop offset="100%" stop-color="#1E90FF"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
    </svg>
  `;

  // Resize logo to fit nicely
  const logoBuffer = await sharp(logoPath)
    .resize(220, 124, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Composite: gradient background + logo centered
  await sharp(Buffer.from(gradientSvg))
    .composite([
      {
        input: logoBuffer,
        gravity: 'centre',
        blend: 'over'
      },
      {
        input: Buffer.from(`<svg width="${width}" height="${height}">
          <text x="${width/2}" y="320" text-anchor="middle" font-family="Arial" font-size="18" font-weight="900" fill="white" letter-spacing="2">MOBILE LEGENDS</text>
          <text x="${width/2}" y="345" text-anchor="middle" font-family="Arial" font-size="12" font-weight="600" fill="#87CEEB" letter-spacing="3">BANG BANG</text>
          <text x="${width/2}" y="385" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="white" opacity="0.5" letter-spacing="1">KARMA</text>
          <line x1="40" y1="380" x2="260" y2="380" stroke="#1E90FF" stroke-width="2" opacity="0.6"/>
        </svg>`),
        blend: 'over'
      }
    ])
    .png()
    .toFile(outputPath);

  console.log('✅ Created topup-mlbb.png');
}

createMLBBImage().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
