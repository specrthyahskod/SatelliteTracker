// utils/fetchStream.js
const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const { Readable } = require('stream');

module.exports = async function fetchAudioStream(videoUrl) {
  try {
    const { url } = await youtubedl(videoUrl, {
      dumpSingleJson: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      noCheckCertificate: true,
      noWarnings: true,
      format: 'bestaudio',
    });

    return ffmpeg(url)
      .format('s16le')
      .audioChannels(2)
      .audioFrequency(48000)
      .audioCodec('pcm_s16le')
      .pipe();
  } catch (err) {
    console.error('❌ yt-dlp error:', err);
    throw new Error('Failed to fetch stream');
  }
};
