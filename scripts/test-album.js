const { chromium } = require("playwright");

const ALBUM_URL = "https://csmfactory.x.yupoo.com/albums/235513217?uid=1&isSubCate=false&referrercate=5125965";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(ALBUM_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);

  await page.evaluate(async () => {
    for (let i = 0; i < 8; i++) {
      window.scrollBy(0, 1000);
      await new Promise((r) => setTimeout(r, 500));
    }
  });

  const images = await page.evaluate(() => {
    return [...document.querySelectorAll("img")]
      .map((img) => img.src || img.dataset.src || img.getAttribute("data-src") || "")
      .filter((src) => src.includes("photo.yupoo.com"));
  });

  console.log(images);
  console.log("Found album images:", images.length);

  await browser.close();
})();
