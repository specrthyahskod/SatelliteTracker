const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generates a music playlist using GPT based on user history
 * @param {Array} userHistory - Array of track names or artist preferences
 * @param {string} platform - Preferred platform: spotify, apple music, etc.
 * @returns {string} formatted playlist text
 */
module.exports = async function generateGPTPlaylist(userHistory, platform = 'spotify') {
  const prompt = `
You are a music recommendation engine. Based on the user's recent listening history below, generate a personalized 10-song playlist. Output only song and artist names in this format:

- Song Name – Artist

Make sure all songs are discoverable on ${platform}.

User listening history: ${JSON.stringify(userHistory, null, 2)}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const responseText = completion.choices[0].message.content.trim();
    return responseText;
  } catch (err) {
    console.error('❌ GPT Playlist Error:', err);
    return '❌ Failed to generate playlist using GPT.';
  }
};
