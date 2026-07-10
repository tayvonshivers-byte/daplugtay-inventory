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
  { brand: "Hellstar", url: "https://csmfactory.x.yupoo.com/categories/5121862" },
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
const MAX_RETRIES = 5;

const PROGRESS_FILE = "public/data/products-progress.json";
const FINAL_FILE = "public/data/products.json";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pageUrl(baseUrl, pageNumber) {
  return pageNumber === 1 ? baseUrl : `${baseUrl}?page=${pageNumber}`;
}

function cleanImageUrl(url) {
  return url
    .replace("/small.jpeg", "/medium.jpeg")
    .replace("/square.jpeg", "/medium.jpeg");
}

function imageKey(url) {
  return url
    .replace("/small.jpeg", "")
    .replace("/medium.jpeg", "")
    .replace("/square.jpeg", "");
}

function isBadImage(url) {
  return (
    !url ||
    !url.includes("photo.yupoo.com") ||
    url.includes("logo") ||
    url.includes("loading") ||
    url.includes("icon") ||
    url.includes("avatar") ||
    url.endsWith(".svg")
  );
}

function skuFor(brand, number) {
  const prefix = brand
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();

  return `${prefix}-${String(number).padStart(4, "0")}`;
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return {
      products: [],
      completedPages: [],
    };
  }

  try {
    const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));

    console.log(
      `RESUMING: Found ${progress.products?.length || 0} saved products`
    );

    return {
      products: Array.isArray(progress.products) ? progress.products : [],
      completedPages: Array.isArray(progress.completedPages)
        ? progress.completedPages
        : [],
    };
  } catch (error) {
    console.log("Progress file could not be read. Starting fresh.");

    return {
      products: [],
      completedPages: [],
    };
  }
}

function saveProgress(products, completedPages) {
  fs.mkdirSync("public/data", { recursive: true });

  fs.writeFileSync(
    PROGRESS_FILE,
    JSON.stringify(
      {
        products,
        completedPages,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
}

async function gotoWithRetry(page, url, label) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`${label} — attempt ${attempt}/${MAX_RETRIES}`);

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      return true;
    } catch (error) {
      console.log(`Connection failed: ${error.message}`);

      if (attempt < MAX_RETRIES) {
        console.log("Waiting 15 seconds before retrying...");
        await sleep(15000);
      }
    }
  }

  return false;
}

async function scrollPage(page, times = 10) {
  await page.evaluate(async (scrollTimes) => {
    for (let i = 0; i < scrollTimes; i++) {
      window.scrollBy(0, 1000);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }, times);
}

async function getAlbumImages(page, albumUrl) {
  const loaded = await gotoWithRetry(page, albumUrl, "Opening album");

  if (!loaded) {
    return [];
  }

  await page.waitForTimeout(2500);
  await scrollPage(page, 10);

  const rawImages = await page.evaluate(() => {
    return [...document.querySelectorAll("img")]
      .map(
        (img) =>
          img.src ||
          img.dataset.src ||
          img.getAttribute("data-src") ||
          img.getAttribute("data-original") ||
          ""
      )
      .filter(Boolean);
  });

  const seenImages = new Set();
  const images = [];

  for (const rawImage of rawImages) {
    if (isBadImage(rawImage)) continue;

    const key = imageKey(rawImage);

    if (seenImages.has(key)) continue;

    seenImages.add(key);
    images.push(cleanImageUrl(rawImage));
  }

  return images;
}

(async () => {
  const progress = loadProgress();
  const products = progress.products;
  const completedPages = new Set(progress.completedPages);

  const seenAlbums = new Set(
    products.map((product) => product.source).filter(Boolean)
  );

  const brandCounts = {};

  for (const product of products) {
    brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
  }

  let browser;

  try {
    browser = await chromium.launch({ headless: false });

    const categoryPage = await browser.newPage();
    const albumPage = await browser.newPage();

    for (const category of CATEGORIES) {
      console.log(`\n==============================`);
      console.log(`BRAND: ${category.brand}`);
      console.log(`==============================`);

      brandCounts[category.brand] = brandCounts[category.brand] || 0;

      for (
        let pageNumber = 1;
        pageNumber <= MAX_PAGES_PER_BRAND;
        pageNumber++
      ) {
        const pageKey = `${category.brand}::${pageNumber}`;

        if (completedPages.has(pageKey)) {
          console.log(`Skipping completed page ${pageNumber}`);
          continue;
        }

        const url = pageUrl(category.url, pageNumber);

        const loaded = await gotoWithRetry(
          categoryPage,
          url,
          `Opening ${category.brand} page ${pageNumber}`
        );

        if (!loaded) {
          console.log("\nIMPORT PAUSED because the internet is unavailable.");
          console.log("Your progress has been saved.");
          console.log("Run the same command later to resume.");

          saveProgress(products, [...completedPages]);

          if (browser) {
            await browser.close();
          }

          process.exit(0);
        }

        await categoryPage.waitForTimeout(3500);
        await scrollPage(categoryPage, 12);

        const albums = await categoryPage.evaluate(() => {
          return [...document.querySelectorAll("a")]
            .map((anchor) => {
              const image = anchor.querySelector("img");

              if (!image) return null;

              return {
                source: anchor.href,
                cover:
                  image.src ||
                  image.dataset.src ||
                  image.getAttribute("data-src") ||
                  image.getAttribute("data-original") ||
                  "",
              };
            })
            .filter(
              (item) =>
                item &&
                typeof item.source === "string" &&
                item.source.includes("/albums/")
            );
        });

        let savedThisPage = 0;

        for (const album of albums) {
          if (seenAlbums.has(album.source)) continue;

          console.log(`\nProduct ${products.length + 1}`);
          console.log(album.source);

          let images = [];

          try {
            images = await getAlbumImages(albumPage, album.source);
          } catch (error) {
            console.log(`Album error: ${error.message}`);
          }

          if (images.length === 0 && album.cover) {
            images = [cleanImageUrl(album.cover)];
          }

          if (images.length === 0) {
            console.log("No usable images found. Skipping.");
            continue;
          }

          seenAlbums.add(album.source);
          brandCounts[category.brand]++;

          products.push({
            id: products.length + 1,
            sku: skuFor(category.brand, brandCounts[category.brand]),
            brand: category.brand,
            title: `${category.brand} #${brandCounts[category.brand]}`,
            image: images[0],
            images,
            source: album.source,
          });

          savedThisPage++;

          // Autosave after every product.
          saveProgress(products, [...completedPages]);

          console.log(
            `SAVED: ${category.brand} product ${brandCounts[category.brand]}`
          );
          console.log(`POV images: ${images.length}`);
          console.log(`Total products saved: ${products.length}`);
        }

        completedPages.add(pageKey);
        saveProgress(products, [...completedPages]);

        console.log(
          `Finished ${category.brand} page ${pageNumber}: ${savedThisPage} new products`
        );

        if (savedThisPage === 0 && pageNumber > 1) {
          console.log(`No new products. Finished ${category.brand}.`);
          break;
        }
      }
    }

    fs.writeFileSync(FINAL_FILE, JSON.stringify(products, null, 2));

    if (fs.existsSync(PROGRESS_FILE)) {
      fs.unlinkSync(PROGRESS_FILE);
    }

    console.log(
      `\nDONE: Imported ${products.length} products with galleries`
    );
  } catch (error) {
    console.log("\nIMPORT STOPPED:");
    console.log(error.message);
    console.log("Your saved progress is safe.");
    console.log("Run the importer again to resume.");

    saveProgress(products, [...completedPages]);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
})();