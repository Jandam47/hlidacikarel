export default async function handler(req, res) {
  try {
    const url =
      "https://live.luigisbox.tech/search" +
      "?q=beyblade" +
      "&size=20" +
      "&offset=0" +
      "&tracker_id=odkarla";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const contentType = response.headers.get("content-type");
    const raw = await response.text();

    // ⛑️ ochrana proti HTML odpovědi
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(502).json({
        error: "LuigisBox nevrátil JSON",
        preview: raw.slice(0, 150)
      });
    }

    const data = JSON.parse(raw);

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
    res.status(500).json({ error: e.message });
  }
}
``
