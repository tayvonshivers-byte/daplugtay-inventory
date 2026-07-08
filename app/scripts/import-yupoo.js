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

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const allProducts = [];
  const seenImages = new Set();

  for (const category of CATEGORIES) {
    console.log(`Opening ${category.brand}...`);

    await page.goto(category.url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForTimeout(4000);

    await page.evaluate(async () => {
      for (let i = 0; i < 12; i++) {
        window.scrollBy(0, 1000);
        await new Promise((r) => setTimeout(r, 500));
      }
    });

    const products = await page.evaluate((category) => {
      const imgs = [...document.querySelectorAll("img")];

      return imgs
        .map((img, i) => ({
          title: img.alt || `${category.brand} Product ${i + 1}`,
          image:
            img.src ||
            img.dataset.src ||
            img.getAttribute("data-original") ||
            "",
          brand: category.brand,
          category: category.brand,
          price: "Contact",
        }))
        .filter((p) => p.image.startsWith("http"));
    }, category);

    for (const product of products) {
      if (!seenImages.has(product.image)) {
        seenImages.add(product.image);
        allProducts.push({
          id: allProducts.length + 1,
          ...product,
        });
      }
    }

    console.log(`Found ${products.length} images in ${category.brand}`);
  }

  fs.mkdirSync("public/data", { recursive: true });

  fs.writeFileSync(
    "public/data/products.json",
    JSON.stringify(allProducts, null, 2)
  );

  console.log(`Imported ${allProducts.length} total images`);

  await browser.close();
})();