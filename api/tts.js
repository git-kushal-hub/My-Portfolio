/**
 * Vercel Serverless Function: Text-to-Speech Proxy
 * This handles the voice synthesis for your portfolio intro.
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Vercel Configuration Error: GEMINI_API_KEY is missing for TTS.");
    return res.status(500).json({ error: 'API key not configured for voice service.' });
  }

  try {
    // Model used: gemini-2.5-flash-preview-tts
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `Say in a warm, professional, and sincere tone: ${text}` }] 
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { 
                voiceName: "Kore" 
              } 
            } 
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google TTS Error:", JSON.stringify(errorData));
      return res.status(response.status).json({ error: "Voice generation failed." });
    }

    const data = await response.json();
    
    // Extract the raw audio data (PCM16 format)
    const audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audio) {
      throw new Error("No audio data returned from service.");
    }

    // Return the base64 audio to the frontend
    return res.status(200).json({ audio });
  } catch (error) {
    console.error("TTS Proxy Exception:", error);
    return res.status(500).json({ error: "Internal server error connecting to Voice AI." });
  }
}
