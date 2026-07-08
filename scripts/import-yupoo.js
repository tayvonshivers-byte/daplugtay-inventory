const fs = require("fs");
const { chromium } = require("playwright");

const CATEGORIES = [
  { brand: "Lululemon", url: "https://csmfactory.x.yupoo.com/categories/5125965" },
  { brand: "Supreme", url: "https://csmfactory.x.yupoo.com/categories/5204687" },
  { brand: "Godspeed", url: "https://csmfactory.x.yupoo.com/categories/5121866" },
  { brand: "Slides", url: "https://csmfactory.x.yupoo.com/categories/5206732" },
  { brand: "Mixed Emotions", url: "https://csmfactory.x.yupoo.com/categories/5205533" },
  { brand: "Gallery Dept", url: "https://csmfactory.x.yupoo.com/categories/5128935" },
  { brand: "Balenciaga", url: "https://csmfactory.x.yupoo.com/categories/5205305" },
  { brand: "Valley", url: "https://csmfactory.x.yupoo.com/categories/5127803" },
  { brand: "Beanie + Socks", url: "https://csmfactory.x.yupoo.com/categories/5204635" },
  { brand: "Hellstar", url: "https://csmfactory.x.yupoo.com/categories/5121862?page=1" },
  { brand: "Amiri", url: "https://csmfactory.x.yupoo.com/categories/5128892" },
  { brand: "Chrome Hearts", url: "https://csmfactory.x.yupoo.com/categories/5126696" },
  { brand: "Bape", url: "https://csmfactory.x.yupoo.com/categories/5121859" },
  { brand: "Majestik", url: "https://csmfactory.x.yupoo.com/categories/5205093" },
  { brand: "Purple", url: "https://csmfactory.x.yupoo.com/categories/5205389" },
  { brand: "Denim Tears", url: "https://csmfactory.x.yupoo.com/categories/5243150" },
  { brand: "Essential", url: "https://csmfactory.x.yupoo.com/categories/5121858" },
  { brand: "Acne Studios", url: "https://csmfactory.x.yupoo.com/categories/5204954" },
  { brand: "Palm Angel", url: "https://csmfactory.x.yupoo.com/categories/5128933" },
  { brand: "Jeans", url: "https://csmfactory.x.yupoo.com/categories/5121864" },
  { brand: "Harmony", url: "https://csmfactory.x.yupoo.com/categories/5205293" },
  { brand: "Winter Coats", url: "https://csmfactory.x.yupoo.com/categories/5127843" },
  { brand: "Sp555der", url: "https://csmfactory.x.yupoo.com/categories/5122827" },
  { brand: "Eric Emanuel", url: "https://csmfactory.x.yupoo.com/categories/5205509" },
  { brand: "Saint Vanity", url: "https://csmfactory.x.yupoo.com/categories/5205445" },
];

const MAX_PAGES_PER_BRAND = 10;

function badImage(url) {
  return (
    !url ||
    url.includes("logo") ||
    url.includes("loading") ||
    url.includes("icon") ||
    url.endsWith(".svg")
  );
}

function pageUrl(baseUrl, pageNumber) {
  if (pageNumber === 1) return baseUrl;
  return `${baseUrl}?page=${pageNumber}`;
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const products = [];
  const seenAlbums = new Set();

  for (const cat of CATEGORIES) {
    console.log(`\n=== ${cat.brand} ===`);

    for (let pageNumber = 1; pageNumber <= MAX_PAGES_PER_BRAND; pageNumber++) {
      const url = pageUrl(cat.url, pageNumber);
      console.log(`Opening page ${pageNumber}: ${url}`);

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(4000);

      await page.evaluate(async () => {
        for (let i = 0; i < 12; i++) {
          window.scrollBy(0, 1000);
          await new Promise((r) => setTimeout(r, 350));
        }
      });

      const items = await page.evaluate((cat) => {
        return [...document.querySelectorAll("a")]
          .map((a, i) => {
            const img = a.querySelector("img");
            if (!img) return null;

            return {
              id: 0,
              brand: cat.brand,
              title: `${cat.brand} #${i + 1}`,
              image:
                img.src ||
                img.dataset.src ||
                img.getAttribute("data-src") ||
                img.getAttribute("data-original") ||
                "",
              source: a.href,
            };
          })
          .filter(Boolean);
      }, cat);

      let savedThisPage = 0;

      for (const item of items) {
        if (badImage(item.image)) continue;
        if (!item.source.includes("/albums/")) continue;
        if (seenAlbums.has(item.source)) continue;

        seenAlbums.add(item.source);
        products.push({
          ...item,
          id: products.length + 1,
        });

        savedThisPage++;
      }

      console.log(`Saved ${savedThisPage} new items from page ${pageNumber}`);

      if (savedThisPage === 0 && pageNumber > 1) {
        console.log(`No new items found. Stopping ${cat.brand}.`);
        break;
      }
    }
  }

  fs.mkdirSync("public/data", { recursive: true });
  fs.writeFileSync(
    "public/data/products.json",
    JSON.stringify(products, null, 2)
  );

  console.log(`\nDONE: Imported ${products.length} total products`);
  await browser.close();
})();
