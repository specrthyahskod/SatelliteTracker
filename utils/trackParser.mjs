// trackParser.mjs
export async function parseTrack(link) {
  let trackTitle = null;

  if (link.includes('spotify')) {
    const { getData } = await import('spotify-url-info');
    const fetch = (await import('node-fetch')).default;
    const data = await getData(fetch)(link);
    trackTitle = `${data.artist} ${data.name}`;
  } else if (link.includes('music.apple.com')) {
    const axios = (await import('axios')).default;
    const res = await axios.get(link);
    const match = res.data.match(/"trackName":"(.*?)","artistName":"(.*?)"/);
    if (match) trackTitle = `${match[2]} ${match[1]}`;
  } else if (link.includes('deezer')) {
    const axios = (await import('axios')).default;
    const res = await axios.get(link);
    const match = res.data.match(/"SNG_TITLE":"(.*?)","ART_NAME":"(.*?)"/);
    if (match) trackTitle = `${match[2]} ${match[1]}`;
  } else {
    trackTitle = link;
  }

  return trackTitle;
}
