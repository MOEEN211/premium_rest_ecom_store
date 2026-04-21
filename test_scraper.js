import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  console.log("Navigating to homepage...");
  await page.goto('https://premiumrestfurniture.co.uk/', { waitUntil: 'networkidle2' });
  
  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product')).map(el => {
      const nameEl = el.querySelector('.woocommerce-loop-product__title, h2, h3');
      const linkEl = el.querySelector('a');
      const imgEl = el.querySelector('img');
      
      return {
        name: nameEl ? nameEl.innerText.trim() : null,
        link: linkEl ? linkEl.href : null,
        img: imgEl ? imgEl.src : null
      };
    }).filter(p => p.name && (p.name.toLowerCase().includes('bed') || p.link.toLowerCase().includes('bed')));
  });
  
  const uniqueProducts = [];
  const links = new Set();
  for (const p of products) {
    if (!links.has(p.link)) {
      links.add(p.link);
      uniqueProducts.push(p);
    }
  }

  console.log(`Found ${uniqueProducts.length} unique beds:` );
  console.log(JSON.stringify(uniqueProducts, null, 2));

  await browser.close();
})();
