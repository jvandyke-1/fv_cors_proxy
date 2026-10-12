export default async function handler(req, res) {
  // Inject CORS headers so Chrome allows the PWA to receive the data
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle browser pre-flight OPTIONS check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const fetchHeaders = {
      'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded',
    };
    if (req.headers['cookie']) {
      fetchHeaders['Cookie'] = req.headers['cookie'];
    }

    let requestBody = undefined;
    if (req.method === 'POST' && req.body) {
      if (typeof req.body === 'object') {
        requestBody = new URLSearchParams(req.body).toString();
      } else {
        requestBody = req.body;
      }
    }

    const response = await fetch(url, {
      method: req.method,
      headers: fetchHeaders,
      body: requestBody,
    });

    const text = await response.text();
    return res.status(response.status).send(text);
  } catch (e) {
    return res.status(500).send(`Proxy Error: ${e.message}`);
  }
}
