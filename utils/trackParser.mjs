// trackParser.mjs

import fetch from 'node-fetch';
import axios from 'axios';
import spotifyUrlInfo from 'spotify-url-info';

const { getData } = spotifyUrlInfo(fetch);

export default async function parseTrackFromLink(link) {
  let trackTitle = null;

  if (link.includes('spotify')) {
    const data = await getData(link);
    trackTitle = `${data.artist} ${data.name}`;
  } else if (link.includes('music.apple.com')) {
    const res = await axios.get(link);
    const match = res.data.match(/"trackName":"(.*?)","artistName":"(.*?)"/);
    if (match) trackTitle = `${match[2]} ${match[1]}`;
  } else if (link.includes('deezer')) {
    const res = await axios.get(link);
    const match = res.data.match(/"SNG_TITLE":"(.*?)","ART_NAME":"(.*?)"/);
    if (match) trackTitle = `${match[2]} ${match[1]}`;
  } else {
    trackTitle = link; // Plain text search fallback
  }

  return trackTitle;
}
