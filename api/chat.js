/**
 * Vercel Serverless Function: Chat Proxy
 * This runs on the server side, keeping your API key 100% hidden from the browser.
 */
export default async function handler(req, res) {
  // Only allow POST requests from your frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, systemInstruction, isJson } = req.body;
  
  // This pulls the secret key you just updated in the Vercel Dashboard
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Vercel Configuration Error: GEMINI_API_KEY is missing.");
    return res.status(500).json({ error: 'API key not configured on server. Please check your Vercel Environment Variables.' });
  }

  try {
    // Model used: gemini-2.0-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        systemInstruction: { 
          parts: [{ text: systemInstruction }] 
        },
        generationConfig: {
          ...(isJson ? { responseMimeType: "application/json" } : {})
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google API Error Response:", JSON.stringify(errorData));
      return res.status(response.status).json({ 
        error: "The AI service returned an error.", 
        details: errorData.error?.message || "Unknown error" 
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("The AI model returned an empty response.");
    }

    // Success: return the text to your portfolio frontend
    return res.status(200).json({ text });
  } catch (error) {
    console.error("Backend Proxy Exception:", error);
    return res.status(500).json({ error: "Internal server error connecting to AI." });
  }
}
