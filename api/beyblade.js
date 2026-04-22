export default async function handler(req, res) {
  try {
    const url =
      "https://live.luigisbox.tech/search" +
      "?q=beyblade" +
      "&size=20" +
      "&offset=0";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    const hits = data?.results?.hits || [];

    const result = hits.map(p => ({
      name: p.attributes?.title || "bez názvu",
      price: p.attributes?.price_amount
        ? p.attributes.price_amount + " Kč"
        : "-",
      link: p.url
        ? "https://www.odkarla.cz" + p.url
        : "#"
    }));

    res.status(200).json(result);

  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}
``
