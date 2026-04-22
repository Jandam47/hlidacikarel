export default async function handler(req, res) {
    const url = "https://www.odkarla.cz/vyhledavani?q=beyblade";

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = await response.text();

        const items = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>[\s\S]*?(\d+\s*Kč)/g)];

        const result = items.slice(0, 30).map(m => ({
            name: m[2].replace(/<[^>]+>/g, "").trim(),
            price: m[3],
            link: "https://odkarla.cz" + m[1]
        }));

        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({ error: "Chyba při načítání" });
    }
}
