// scheduler/launchAlert.js
const axios = require('axios');
const cron = require('node-cron');

const notified = new Set();

module.exports = function startLaunchAlerts(client) {
  cron.schedule('0 * * * *', async () => {
    try {
      const channel = await client.channels.fetch(process.env.TARGET_CHANNEL_ID);
      if (!channel) return;

      const now = new Date().toISOString();
      const withinHour = new Date(Date.now() + 3600000).toISOString();
      const { data } = await axios.get(
        `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?window_start__gte=${now}&window_start__lte=${withinHour}`
      );

      for (const launch of data.results) {
        if (notified.has(launch.id)) continue;
        notified.add(launch.id);
        await channel.send(`<@${channel.guild.ownerId}> 🚀 **Launch Alert:** ${launch.name}\n🕒 ${new Date(launch.window_start).toLocaleString()} UTC`);
      }
    } catch (err) {
      console.error('[Launch Scheduler Error]', err);
    }
  });
};
