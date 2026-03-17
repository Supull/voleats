import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { service_area_id, date } = req.query;

  if (!service_area_id || !date) {
    return res.status(400).json({ error: "Missing service_area_id or date" });
  }

  const url = `https://dining.utk.edu/wp-admin/admin-ajax.php?action=get_cached_nutrition&service_area_id=${service_area_id}&date=${date}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: `UTK API returned ${response.status}` });
    }

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch nutrition from UTK dining API" });
  }
}