const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = gemini.getGenerativeModel({ model: 'gemini-pro' });

module.exports = async function generateAIPlaylist(userHistory, platform = 'spotify') {
  const prompt = `Based on the user's recent listening history: ${JSON.stringify(userHistory)} — create a personalized 10-song playlist. Return in this format:
  - Song Name – Artist
  Format it so it can be easily searched on ${platform}.`;

  const result = await model.generateContent(prompt);
  const playlist = result.response.text();

  return playlist;
};
