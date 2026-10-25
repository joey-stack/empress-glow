const http = require('http');

async function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== VERIFYING FULL CATALOG CARDS VS PDP IMAGES (/products) ===\n');
  const catalog = await get('/products');
  const cardRegex = /href="\/product\/([^"]+)"[\s\S]*?<img[^>]+src="([^"]+)"/g;
  let match;
  const cards = [];
  while ((match = cardRegex.exec(catalog.body)) !== null) {
    const slug = match[1];
    const rawSrc = decodeURIComponent(match[2]);
    const cleanImg = rawSrc.match(/url=([^&]+)/)?.[1] || rawSrc;
    cards.push({ slug, cardImg: cleanImg });
  }

  console.log(`Found ${cards.length} cards in catalog.`);

  let allMatch = true;
  for (const { slug, cardImg } of cards) {
    const pdp = await get(`/product/${slug}`);
    const pdpImgMatch = pdp.body.match(/<img[^>]+alt="[^"]* - Editorial Presentation"[^>]+src="([^"]+)"/) ||
                        pdp.body.match(/aspect-\[4\/5\][\s\S]*?<img[^>]+src="([^"]+)"/);
    const pdpRawSrc = pdpImgMatch ? decodeURIComponent(pdpImgMatch[1]) : 'NO_IMAGE';
    const cleanPdpImg = pdpRawSrc.match(/url=([^&]+)/)?.[1] || pdpRawSrc;
    const matches = cardImg === cleanPdpImg;
    if (!matches) allMatch = false;
    console.log(`[${matches ? 'MATCH' : 'MISMATCH'}] ${slug}`);
    console.log(`   Card Image: ${cardImg}`);
    console.log(`   PDP Image:  ${cleanPdpImg}`);
  }

  console.log(`\nOVERALL STATUS: ${allMatch ? 'PERFECT - ALL CARDS MATCH PDP IMAGES' : 'FAILED - MISMATCH FOUND'}`);
}

run().catch(console.error);
