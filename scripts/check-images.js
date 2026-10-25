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
  const home = await get('/');
  // Extract product card links and their img srcs from home
  console.log('--- Homepage Cards ---');
  const cardRegex = /href="\/product\/([^"]+)"[\s\S]*?<img[^>]+src="([^"]+)"/g;
  let match;
  const homeCards = {};
  while ((match = cardRegex.exec(home.body)) !== null) {
    const slug = match[1];
    const rawSrc = match[2];
    const decoded = decodeURIComponent(rawSrc);
    homeCards[slug] = decoded;
    console.log(`Card [${slug}] => ${decoded.substring(0, 100)}`);
  }

  console.log('\n--- PDP First Gallery Image ---');
  for (const slug of Object.keys(homeCards)) {
    const pdp = await get(`/product/${slug}`);
    const pdpImgMatch = pdp.body.match(/<img[^>]+alt="[^"]* - Editorial Presentation"[^>]+src="([^"]+)"/);
    if (pdpImgMatch) {
      console.log(`PDP  [${slug}] => ${decodeURIComponent(pdpImgMatch[1]).substring(0, 100)}`);
    } else {
      const anyImg = pdp.body.match(/aspect-\[4\/5\][\s\S]*?<img[^>]+src="([^"]+)"/);
      console.log(`PDP  [${slug}] => ${anyImg ? decodeURIComponent(anyImg[1]).substring(0, 100) : 'NO MATCH'}`);
    }
  }
}

run().catch(console.error);
