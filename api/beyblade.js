export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://www.odkarla.cz/api/search?q=beyblade",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        const items = data?.products || [];

        const result = items.map(p => ({
            name: p.name,
            price: p.price + " Kč",
            link: "https://www.odkarla.cz" + p.url
        }));

        res.status(200).json(result);

    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
}
