import { chromium } from "playwright-core";

export default async function handler(req, res) {
    const url = "https://www.odkarla.cz/vyhledavani?q=beyblade";

    try {
        const browser = await chromium.launch({
            args: ["--no-sandbox"],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle" });

        // počkej na produkty (můžeš doladit selector)
        await page.waitForTimeout(3000);

        const data = await page.evaluate(() => {
            const items = [];

            document.querySelectorAll("a").forEach(el => {
                const text = el.innerText;
                const priceMatch = text.match(/\d+\s*Kč/);

                if (text.toLowerCase().includes("beyblade") && priceMatch) {
                    items.push({
                        name: text.trim(),
                        price: priceMatch[0],
                        link: el.href
                    });
                }
            });

            return items.slice(0, 30);
        });

        await browser.close();

        res.status(200).json(data);

    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
}
