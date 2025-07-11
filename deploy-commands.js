console.log('🚀 Starting command deployment...');
require('dotenv').config(); // Load environment variables

const { REST, Routes } = require('discord.js'); // Import REST and Routes from discord.js
const fs = require('node:fs'); // Node.js file system module
const path = require('node:path'); // Node.js path module

// Get your bot token and client ID from environment variables
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // You'll need to add CLIENT_ID to your .env
// const GUILD_ID = process.env.GUILD_ID; // Optional: If you want to deploy to a specific guild for testing

if (!TOKEN) {
    console.error('❌ DISCORD_TOKEN is not set in your .env file.');
    process.exit(1);
}
if (!CLIENT_ID) {
    console.error('❌ CLIENT_ID is not set in your .env file. Get it from Discord Developer Portal -> Your App -> General Information.');
    process.exit(1);
}

const commands = []; // Array to hold command data for deployment
// Grab all the command files from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    let command;
    if (file.endsWith('.mjs')) {
        // Dynamic import for ES Modules
        command = require(filePath); 
    } else {
        // CommonJS require for .js files
        command = require(filePath);
    }

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON()); // Add the command's JSON data to the array
        console.log(`✅ Prepared command for deployment: /${command.data.name}`);
    } else {
        console.warn(`⚠️ Skipped ${file} — missing "data" or "execute" for deployment.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN);

// Deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID), // Deploy globally
            { body: commands },
        );


        console.log(`Successfully reloaded ${data.length} application (/) commands globally.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error('❌ Failed to deploy commands:', error);
    }
})();
