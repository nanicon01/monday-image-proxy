export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const token = process.env.MONDAY_TOKEN;

    const response = await fetch(decodeURIComponent(url), {
      headers: {
        "Authorization": token
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "Failed to fetch image" 
      });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") 
      || "image/jpeg";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(buffer));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

4. Scroll down click **Commit new file**

---

## Step 4 — Create a Vercel Account

1. Go to **vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub

---

## Step 5 — Deploy to Vercel

1. On Vercel dashboard click **Add New → Project**
2. Find **monday-image-proxy** in the list
3. Click **Import**
4. Leave all settings as default
5. Click **Deploy**
6. Wait about 1 minute
7. You'll see a success screen with a URL like:
```
   https://monday-image-proxy-yourname.vercel.app
```
8. **Copy that URL and save it**

---

## Step 6 — Add Your monday.com API Token

1. On Vercel go to your project
2. Click **Settings** tab
3. Click **Environment Variables** on the left
4. Add a new variable:
   - **Name:** `MONDAY_TOKEN`
   - **Value:** paste your monday.com API token
5. Click **Save**
6. Go to **Deployments** tab
7. Click the **3 dots** on the latest deployment
8. Click **Redeploy** so the token takes effect

---

## Step 7 — Test the Proxy

1. Open a new browser tab
2. Test with this URL format:
```
   https://monday-image-proxy-yourname.vercel.app/api/image-proxy?url=https://files.monday.com/your-image-url
```
3. If it works you'll see the image load in the browser

---

## Step 8 — Update Vibe with This Prompt
```
The image CORS issue is now solved via a Vercel proxy.
Do not modify any existing backend, API calls, or file 
upload functions.

Update the PDF image fetching to use this proxy:

PROXY URL:
https://monday-image-proxy-yourname.vercel.app/api/image-proxy

HOW TO USE IT:
For each subitem, get the file URL from column 
file_mm0x166x, then fetch the image like this:

  const proxyUrl = `https://monday-image-proxy-yourname
    .vercel.app/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;

  const response = await fetch(proxyUrl);
  const blob = await response.blob();
  const base64 = await convertBlobToBase64(blob);

  function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

Use the base64 result as the image source in the PDF.

Fetch all subitem images in parallel using Promise.all() 
before PDF generation starts.

If proxy returns an error for any image, fall back to 
the colored letter placeholder for that item only.

Replace yourname in the URL with the actual Vercel 
deployment URL.
