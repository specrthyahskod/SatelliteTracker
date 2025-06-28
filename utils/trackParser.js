const axios = require('axios');
const { getData } = require('spotify-url-info')(require('node-fetch'));

/**
 * Parses the track title from a streaming link or plain query.
 * Supports Spotify, Apple Music, Deezer, or raw text.
 */
async function parseTrack(input) {
  try {
    if (input.includes('spotify.com/track')) {
      const data = await getData(input);
      return `${data.artist} ${data.name}`;
    }

    if (input.includes('music.apple.com')) {
      const response = await axios.get(input);
      const match = response.data.match(/"trackName":"(.*?)","artistName":"(.*?)"/);
      if (match) {
        return `${match[2]} ${match[1]}`;
      }
    }

    if (input.includes('deezer.com/track')) {
      const response = await axios.get(input);
      const match = response.data.match(/"SNG_TITLE":"(.*?)","ART_NAME":"(.*?)"/);
      if (match) {
        return `${match[2]} ${match[1]}`;
      }
    }

    // If not a known platform, return as-is
    return input;
  } catch (err) {
    console.error('❌ Error parsing track:', err);
    return input; // fallback to raw input
  }
}

module.exports = parseTrack;
