console.log('👋 Satellite Bot: index.js started');
require('dotenv').config();

const { Client, GatewayIntentBits, Collection, InteractionType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: ['CHANNEL']
});

const startSatelliteScheduler = require('./scheduler/satellitePing');
const startLaunchAlerts = require('./scheduler/launchAlert');

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));

(async () => {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        let command;
        if (file.endsWith('.mjs')) {
            command = await import(`file://${filePath}`);
            command = command.default || command;
        } else {
            command = require(filePath);
        }

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: /${command.data.name}`);
        } else {
            console.warn(`⚠️ Skipped ${file} — missing "data" or "execute"`);
        }
    }
    console.log('✨ All commands loaded.');
})();

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    try {
        startSatelliteScheduler(client);
        console.log('🛰️ Satellite scheduler started');
    } catch (e) {
        console.error('❌ Satellite scheduler failed:', e);
    }

    try {
        startLaunchAlerts(client);
        console.log('🚀 Launch alert scheduler started');
    } catch (e) {
        console.error('❌ Launch alert scheduler failed:', e);
    }
});

const handleVolumeButtons = require('./handlers/buttonVolume');
const handleMusicButtons = require('./handlers/musicButtons');

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.warn(`⚠️ Unknown command: /${interaction.commandName}`);
                return;
            }
            console.log(`📥 ${interaction.user.tag} used /${interaction.commandName}`);
            await command.execute(interaction, client);
        }

        if (interaction.isButton()) {
            console.log(`🔘 Button clicked: ${interaction.customId} by ${interaction.user.tag}`);

            if (interaction.customId === 'close_modmail') {
                await interaction.reply({ content: '🛑 Closing ticket...', ephemeral: true });
                setTimeout(() => {
                    interaction.channel.delete().catch(console.error);
                }, 3000);
                return;
            }

            if (['volume_up', 'volume_down'].includes(interaction.customId)) {
                return handleVolumeButtons(interaction);
            }

            if (['music_play', 'music_pause', 'music_skip', 'music_stop'].includes(interaction.customId)) {
                return handleMusicButtons(interaction);
            }
        }

        if (interaction.type === InteractionType.ModalSubmit) {
            const verifyCommand = client.commands.get('verify');
            if (verifyCommand?.handleModal) {
                await verifyCommand.handleModal(interaction, client);
            }
        }

    } catch (err) {
        console.error(`❌ Error in interaction (${interaction.commandName || interaction.customId}):`, err);
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: '❌ Error executing command.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
            }
        } catch (replyErr) {
            console.error('⚠️ Failed to send error reply:', replyErr);
        }
    }
});

process.on('uncaughtException', err => console.error('🔥 Uncaught Exception:', err));
process.on('unhandledRejection', reason => console.error('⚠️ Unhandled Rejection:', reason));

if (!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN.length < 30) {
    console.error('❌ DISCORD_TOKEN is missing or invalid. Check your .env or Pterodactyl env vars.');
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);