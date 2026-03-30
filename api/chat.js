export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, systemInstruction, isJson } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemInstruction || 'You are Kushal Poudel, a financial partner. Respond warmly and concisely.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API Error:', JSON.stringify(errorData));
      return res.status(response.status).json({ error: 'AI service error.', details: errorData });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (!text) throw new Error('Empty response from AI.');

    // If JSON was requested, validate it parses cleanly
    if (isJson) {
      const clean = text.replace(/```json|```/g, '').trim();
      JSON.parse(clean); // will throw if invalid
      return res.status(200).json({ text: clean });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Backend error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
