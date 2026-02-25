export default async function handler(req, res) {
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const token = process.env.MONDAY_TOKEN;

    if (!token) {
      return res.status(500).json({ error: "MONDAY_TOKEN not configured" });
    }

    const response = await fetch(decodeURIComponent(url), {
      headers: {
        "Authorization": token,
        "User-Agent": "monday-image-proxy/1.0"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch image: ${response.statusText}` 
      });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(buffer));

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

---

## Exactly How to Use This

**On GitHub:**
1. Go to your repo
2. Click **Add file → Create new file**
3. In the filename box type:
```
   api/image-proxy.js
```
4. Paste the entire code above
5. Click **Commit new file**

**Then on Vercel:**
1. It will auto-deploy within 30 seconds
2. Visit:
```
   https://your-vercel-url.vercel.app/api/image-proxy
