require("dotenv").config();
const {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  Collection,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const phrasesFilePath = path.resolve(__dirname, "automod/phrases.json");
const phrasesData = JSON.parse(fs.readFileSync(phrasesFilePath, "utf8"));
const phraseCommands = phrasesData.phraseCommands;
const additionalKeywords = phrasesData.additionalKeywords;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();
const config_token = process.env.BOT_TOKEN;

const rest = new REST({ version: "10" }).setToken(config_token);
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  const commandFiles = fs
    .readdirSync(path.resolve(__dirname, "commands"))
    .filter((file) => file.endsWith(".js"));
  const commands = [];

  for (const file of commandFiles) {
    const command = require(path.resolve(__dirname, "commands", file));
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }

  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });
    console.log("Successfully refreshed application (/) commands.");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
    console.log(
      `> ${interaction.user.username} executed command /${interaction.commandName}`,
    );
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Nie udało się wywołać komendy.",
      ephemeral: true,
    });
    console.log(`> Unable to execute command /${interaction.commandName}`);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const contentLower = message.content.toLowerCase();
  let additionalKeywordFound = false;

  for (const keyword of additionalKeywords) {
    if (contentLower.includes(keyword)) {
      additionalKeywordFound = true;
      break;
    }
  }

  if (additionalKeywordFound) {
    for (const [commandName, phrases] of Object.entries(phraseCommands)) {
      for (const phrase of phrases) {
        if (contentLower.includes(phrase.toLowerCase())) {
          const command = client.commands.get(commandName);
          if (command) {
            try {
              await command.execute(message, client);
              console.log(
                `> Automod replied for ${message.author.username} using command /${commandName}`,
              );
            } catch (error) {
              console.error(error);
              console.log(
                `> Automod cannot respond to reply for ${message.author.username} using command /${commandName}`,
              );
            }
            return;
          }
        }
      }
    }
  }
});

client.login(config_token);
