const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load and validate all commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    console.log(`✅ Registered command: /${command.data.name}`);
  } else {
    console.warn(`⚠️ Skipped ${file} — missing "data" or "execute" property.`);
  }
}

// REST client setup
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Deploy commands
(async () => {
  try {
    console.log('🚀 Starting command deployment...');

    // Optional: Clear previous commands for clean update
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] }
    );
    console.log('🧹 Cleared old guild commands.');

    // Register updated commands
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log('✅ Successfully deployed updated application (/) commands!');
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }
})();
