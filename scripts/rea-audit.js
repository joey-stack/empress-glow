const http = require('http');

async function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runAudit() {
  console.log('=== EMPRESS GLOW REA FORENSIC AUDIT ===\n');

  // 1. Gating & Redirects
  const redirectRoutes = ['/shop', '/cart', '/checkout', '/login', '/register', '/account'];
  console.log('--- 1. Testing Route Redirects (Phase 2 Gating) ---');
  for (const route of redirectRoutes) {
    const res = await get(route);
    const pass = res.status === 307 && (res.headers.location === '/' || res.headers.location?.endsWith('/'));
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${route} -> Status: ${res.status}, Location: ${res.headers.location}`);
  }

  // 2. Homepage Content Audit
  console.log('\n--- 2. Auditing Homepage (http://localhost:3000/) ---');
  const home = await get('/');
  const homeBody = home.body;
  const p2PricesHome = (homeBody.match(/3,?000|7,?000|11,?000|16,?000/g) || []).length;
  const nairaHome = (homeBody.match(/\u20A6/g) || []).length;
  const cartIconHome = (homeBody.match(/href=["']\/cart["']/gi) || []).length;
  const accountIconHome = (homeBody.match(/href=["']\/account["']/gi) || []).length;
  const shopNavHome = (homeBody.match(/href=["']\/shop["']/gi) || []).length;
  const nafdacHome = (homeBody.match(/These claims have not been evaluated by NAFDAC/gi) || []).length;

  console.log(`[${p2PricesHome === 0 ? 'PASS' : 'FAIL'}] Phase 2 Leaked Prices: ${p2PricesHome}`);
  console.log(`[${nairaHome === 0 ? 'PASS' : 'FAIL'}] Naira Currency Symbols: ${nairaHome}`);
  console.log(`[${cartIconHome === 0 ? 'PASS' : 'FAIL'}] Cart Link / Icon in Nav: ${cartIconHome}`);
  console.log(`[${accountIconHome === 0 ? 'PASS' : 'FAIL'}] Account Link / Icon in Nav: ${accountIconHome}`);
  console.log(`[${shopNavHome === 0 ? 'PASS' : 'FAIL'}] /shop Link in Nav: ${shopNavHome}`);
  console.log(`[${nafdacHome > 0 ? 'PASS' : 'FAIL'}] Statutory NAFDAC Caveat Found: ${nafdacHome}`);

  // 3. PDP Content Audit
  console.log('\n--- 3. Auditing PDP (http://localhost:3000/product/empress-glow-fruity-soap) ---');
  const pdp = await get('/product/empress-glow-fruity-soap');
  const pdpBody = pdp.body;
  const p2PricesPdp = (pdpBody.match(/3,?000|7,?000|11,?000|16,?000/g) || []).length;
  const nairaPdp = (pdpBody.match(/\u20A6/g) || []).length;
  const addToCartPdp = (pdpBody.match(/add to cart|add to basket/gi) || []).length;
  const notifyMePdp = (pdpBody.match(/notify me|reserve on waitlist/gi) || []).length;
  const nafdacPdp = (pdpBody.match(/These claims have not been evaluated by NAFDAC/gi) || []).length;
  const waConsultPdp = (pdpBody.match(/wa\.me\/2348035650299/g) || []).length;

  console.log(`[${p2PricesPdp === 0 ? 'PASS' : 'FAIL'}] Phase 2 Leaked Prices: ${p2PricesPdp}`);
  console.log(`[${nairaPdp === 0 ? 'PASS' : 'FAIL'}] Naira Currency Symbols: ${nairaPdp}`);
  console.log(`[${addToCartPdp === 0 ? 'PASS' : 'FAIL'}] Add to Cart / Basket Buttons: ${addToCartPdp}`);
  console.log(`[${notifyMePdp > 0 ? 'PASS' : 'FAIL'}] Waitlist / Notify Me CTAs: ${notifyMePdp}`);
  console.log(`[${nafdacPdp > 0 ? 'PASS' : 'FAIL'}] Statutory NAFDAC Caveat: ${nafdacPdp}`);
  console.log(`[${waConsultPdp > 0 ? 'PASS' : 'FAIL'}] WhatsApp Consultation CTA: ${waConsultPdp}`);

  // 4. Products Catalog Page Audit
  console.log('\n--- 4. Auditing Products Catalog (http://localhost:3000/products) ---');
  const catalog = await get('/products');
  const catalogBody = catalog.body;
  const p2PricesCatalog = (catalogBody.match(/3,?000|7,?000|11,?000|16,?000/g) || []).length;
  const nairaCatalog = (catalogBody.match(/\u20A6/g) || []).length;
  const nafdacCatalog = (catalogBody.match(/These claims have not been evaluated by NAFDAC/gi) || []).length;

  console.log(`[${p2PricesCatalog === 0 ? 'PASS' : 'FAIL'}] Phase 2 Leaked Prices: ${p2PricesCatalog}`);
  console.log(`[${nairaCatalog === 0 ? 'PASS' : 'FAIL'}] Naira Currency Symbols: ${nairaCatalog}`);
  console.log(`[${nafdacCatalog > 0 ? 'PASS' : 'FAIL'}] Statutory NAFDAC Caveat: ${nafdacCatalog}`);

  // 5. Legal & Regulatory Compliance
  console.log('\n--- 5. Statutory & Regulatory Audits ---');
  const policies = await get('/policies');
  const unsubscribe = await get('/unsubscribe');

  const dpoPrivacy = (policies.body.match(/dpo@empressglowemporium\.com/gi) || []).length;
  const fccpcRefund = (policies.body.match(/Refunds only for defective products within 7 days of delivery/gi) || []).length;
  const vatFree = (policies.body.match(/VAT Exempt/gi) || []).length;
  const optOut = (unsubscribe.body.match(/opt out|unsubscribe/gi) || []).length;

  console.log(`[${dpoPrivacy > 0 ? 'PASS' : 'FAIL'}] NDPA DPO Monitored Inbox: ${dpoPrivacy} occurrences`);
  console.log(`[${fccpcRefund > 0 ? 'PASS' : 'FAIL'}] FCCPC 7-Day Defect Refund Policy: ${fccpcRefund} occurrences`);
  console.log(`[${vatFree > 0 ? 'PASS' : 'FAIL'}] VAT Small Business Exemption Disclosed: ${vatFree} occurrences`);
  console.log(`[${optOut > 0 ? 'PASS' : 'FAIL'}] Unsolicited Message Opt-Out Screen: ${optOut} occurrences`);

  console.log('\n=== AUDIT COMPLETE ===');
}

runAudit().catch(console.error);
