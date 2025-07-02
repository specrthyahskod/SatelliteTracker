const youtubedl = require('youtube-dl-exec');

module.exports = async function fetchAudioStreamUrl(videoUrl) {
  try {
    const output = await youtubedl(videoUrl, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0'
      ],
      format: 'bestaudio[ext=webm]/bestaudio/best'
    });
    // Find the best audio format URL
    if (output && output.url) return output.url;
    if (output.formats && output.formats.length) {
      const audio = output.formats.find(f => f.asr && f.url);
      if (audio) return audio.url;
    }
    throw new Error('No audio stream found');
  } catch (err) {
    throw new Error('yt-dlp failed: ' + err.message);
  }
};