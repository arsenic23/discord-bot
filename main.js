require('dotenv').config();
const { REST, Routes, Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const config_token = process.env.BOT_TOKEN;

const rest = new REST({ version: '10' }).setToken(config_token);
client.once('ready', async () => {
    console.log(`Logged in as: ${client.user.tag}`);
    const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
        const command = require(path.resolve(__dirname, 'commands', file));
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
    
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Successfully refreshed application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Nie udało sie wywołac komendy.', ephemeral: true });
    }
});

client.login(config_token);
