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

async function verify() {
  console.log('=== VERIFYING PDP FRUITY SOAP IMAGE COUNT ===');
  const pdp = await get('/product/empress-glow-fruity-soap');
  const matches = pdp.body.match(/Editorial Presentation|Botanical Formulation|Artisanal Jar Lineup|Texture & Application/g) || [];
  console.log('Visual badges found on Fruity Soap PDP:', matches);

  const desktopImages = pdp.body.match(/alt="Empress Glow Fruity Soap - [^"]+"/g) || [];
  console.log(`Desktop gallery images for Fruity Soap: ${desktopImages.length}`);
  desktopImages.forEach(img => console.log('  ', img));

  console.log('\n=== VERIFYING HOMEPAGE SECTION ORDER ===');
  const home = await get('/');
  const posMarquee = home.body.indexOf('<!-- 2. INFINITE PILLAR MARQUEE TICKER -->') !== -1 
    ? home.body.indexOf('<!-- 2. INFINITE PILLAR MARQUEE TICKER -->') 
    : home.body.indexOf('Pure Cold Enzymes');
  const posShowcase = home.body.indexOf('id="products"');
  const posStory = home.body.indexOf("The Founder's Journey");
  const posRituals = home.body.indexOf('Three Steps to Natural Radiance');
  const posCommunity = home.body.indexOf('Verified Client Experiences') !== -1
    ? home.body.indexOf('Verified Client Experiences')
    : home.body.indexOf('community');
  const posWhatsapp = home.body.indexOf('Need Guidance on Your Skin Type?');

  console.log('Section Positions:');
  console.log(' 1. Marquee Ticker:            ', posMarquee);
  console.log(' 2. Curated Botanical Showcase:', posShowcase);
  console.log(' 3. Our Story:                 ', posStory);
  console.log(' 4. 3-Step Rituals:            ', posRituals);
  console.log(' 5. Community Carousel:        ', posCommunity);
  console.log(' 6. WhatsApp Consultation:     ', posWhatsapp);

  const isOrdered = posMarquee < posShowcase &&
                    posShowcase < posStory &&
                    posStory < posRituals &&
                    posRituals < posCommunity &&
                    posCommunity < posWhatsapp;

  console.log(`\nHomepage Order Valid: ${isOrdered ? 'YES (Three Steps is ABOVE Community, Community is 2nd to last!)' : 'NO'}`);
}

verify().catch(console.error);
