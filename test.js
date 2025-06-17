console.log('🧪 BOT BOOTING');

require('dotenv').config();
console.log('🔑 DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? '✅ LOADED' : '❌ MISSING');

setTimeout(() => console.log('⏱️ Bot still alive after 5 seconds'), 5000);
