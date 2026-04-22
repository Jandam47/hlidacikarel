import { chromium } from "playwright-core";

export default async function handler(req, res) {
  let browser;

  try {
    browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    let resultJson = null;

    // zachytíme LuigiBox search response
    page.on("response", async response => {
      const url = response.url();
      if (
        url.includes("luigisbox") &&
        url.includes("search")
      ) {
        try {
          const json = await response.json();
          resultJson = json;
        } catch {}
      }
    });

    await page.goto(
      "https://www.odkarla.cz/vyhledavani?q=beyblade",
      { waitUntil: "networkidle" }
    );

    // malá rezerva
    await page.waitForTimeout(2000);

    if (!resultJson) {
      throw new Error("LuigiBox JSON nebyl zachycen");
    }

    const hits = resultJson?.results?.hits || [];

    const data = hits.map(p => ({
      name: p.attributes?.title || "bez názvu",
      price: p.attributes?.price_amount
        ? p.attributes.price_amount + " Kč"
        : "-",
      link: p.url
        ? "https://www.odkarla.cz" + p.url
        : "#"
    }));

    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    if (browser) await browser.close();
  }
}
