const youtubedl = require('youtube-dl-exec');

module.exports = async function fetchAudioStream(url) {
  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      noCheckCertificate: true,
      noWarnings: true,
      format: 'bestaudio'
    });

    if (!info.url) throw new Error('No audio URL found');
    return info.url;
  } catch (err) {
    console.error('❌ yt-dlp error:', err.stderr || err.message);
    throw new Error('Failed to fetch stream');
  }
};
