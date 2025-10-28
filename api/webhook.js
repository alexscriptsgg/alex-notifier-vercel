export default async function handler(req, res) {
  const SECRET = process.env.GAME_SECRET;
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check your secret
  const sentSecret = req.headers["x-game-secret"];
  if (!sentSecret || sentSecret !== SECRET) {
    return res.status(401).json({ error: "Invalid secret" });
  }

  try {
    // Forward the payload to Discord (supports embeds)
    const response = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    // If Discord returns error, forward it back
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Discord failed", details: text });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
