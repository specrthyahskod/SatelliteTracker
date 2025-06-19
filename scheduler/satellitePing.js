const cron = require('node-cron');
const { fetchSatellite } = require('../utils/satellite');

const TRACKED = ['hubble', 'iss'];

// Haversine formula
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = function startScheduler(client) {
  cron.schedule('*/10 * * * * *', async () => {
    try {
      const channel = await client.channels.fetch(process.env.TARGET_CHANNEL_ID);
      if (!channel) return;

      const userLat = parseFloat(process.env.LAT);
      const userLon = parseFloat(process.env.LON);

      for (const name of TRACKED) {
        const data = await fetchSatellite(name);
        if (!data) continue;

        const distance = haversine(userLat, userLon, data.latitude, data.longitude);

        console.log(`[${name}] ${data.latitude}, ${data.longitude} → Distance: ${Math.round(distance)} km`);

        if (distance < 1000) {
          const msg = `📡 Satellite Alert: **${data.name}** is overhead!  
> 🛰️ Altitude: ${data.altitude} km  
> 💨 Speed: ${data.speed} km/s  
> 🌎 Lat: ${data.latitude}°, Lon: ${data.longitude}°  
> _"${data.message}"_`;

          await channel.send({
            content: `<@${channel.guild.ownerId}>`,
            embeds: [{
              title: `🛰️ Satellite Overhead: ${data.name}`,
              description: msg,
              color: 0x1e90ff,
              footer: { text: '📡 Satellite Whisper Bot' },
              timestamp: new Date().toISOString()
            }]
          });

          console.log(`✅ Pinged for ${name} — overhead.`);
        }
      }
    } catch (err) {
      console.error('[Satellite Scheduler Error]', err);
    }
  });
};
