require('dotenv').config();
const { REST, Routes, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const config_token = process.env.BOT_TOKEN;
const allowedChannelId = process.env.ALLOWED_CHANNELID;

const cooldown = new Map();
const cooldownTime = 900000;

const workingicon = ':white_check_mark:';
const timedouticon = ':hourglass:' 
const notworkingicon = ':x:';
const waitingicon = ':arrows_counterclockwise:';

const legenda = `${workingicon} - Serwer działa poprawnie\n${timedouticon} - Serwer nie odpowiada\n${notworkingicon} - Nieoczekiwana odpowiedź serwera`;


const urlsToCheck = [
    'https://lekcjaplus.vulcan.net.pl',
    'https://uonetplus-komunikacja.eszkola.opolskie.pl',
    'https://uonetplus-komunikacja.edu.gdansk.pl',
    'https://uonetplus-komunikacja.edu.lublin.eu',
    'https://uonetplus-komunikacja.umt.tarnow.pl',
    'https://uonetplus-komunikacja.eduportal.koszalin.pl',
];
const urlToNameMap = {
    'https://lekcjaplus.vulcan.net.pl': 'Vulcan UONET+ (standardowa)',
    'https://uonetplus-komunikacja.eszkola.opolskie.pl': 'Opolska eSzkoła',
    'https://uonetplus-komunikacja.edu.gdansk.pl': 'Gdańska Platforma Edukacyjna',
    'https://uonetplus-komunikacja.edu.lublin.eu': 'Lubelski Portal Oświatowy',
    'https://uonetplus-komunikacja.umt.tarnow.pl': 'EduNet Miasta Tarnowa',
    'https://uonetplus-komunikacja.eduportal.koszalin.pl': 'Platforma Edukacyjna Koszalina',
};

const commands = [
    {
        name: 'pobierz',
        description: 'Link do pobrania Vulcanovy na IOS',
    },
    {
        name: 'android',
        description: 'Informacja dotycząca wersji na android',
    },
    {
        name: 'status',
        description: 'Sprawdź status dziennika',
    }
];

const rest = new REST({ version: '10' }).setToken(config_token);

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log(`Logged as: ${client.user.tag}`);
    config_client_id = client.user.id;

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(config_client_id), { body: commands });

        console.log('Successfully refreshed application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const {commandName, channel} = interaction;

    if (commandName === 'android') {
      const embed = new EmbedBuilder()
          .setTitle('Vulcanova na Androidzie')
          .setDescription('Niestety, Vulcanova na Androidzie może się nigdy nie pojawić. Wynika to z kilku przyczyn. Najważniejszą jest brak czasu — Vulcanova to projekt tworzony po godzinach i nie ma czasu na napisanie praktycznie całej aplikacji od nowa.')
          .setColor('#0c79c7')
          .addFields({ name: 'Alternatywna aplikacja', value: 'Możesz zapoznać się z aplikacją naszej zaprzyjaźnionej konkurencji — Wulkanowy, która dostępna jest na Androidzie! Dołącz na jej serwer Discord używając tego [linku](https://discord.gg/Uk3pgVSB2y).'})
          .setTimestamp()
          .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });
  
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (commandName === 'pobierz') {
        const embed = new EmbedBuilder()
            .setTitle('Vulcanova na AppStore')
            .setDescription('Aplikacja Vulcanova jest już dostępna na AppStore i możesz ją pobrać klikając w ten link: [AppStore](https://apps.apple.com/pl/app/vulcanova/id6451334441)')
            .setColor('#0c79c7')
            .addFields({ name: 'Vulcanova Beta', value: 'Jeśli chcesz uczestniczyć w testowaniu aplikacji Vulcanova na platformie Testflight to skorzystaj z tego linku: [TestFlight](https://testflight.apple.com/join/fGMjqr58)'})
            .setTimestamp()
            .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });
    
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }

    if (commandName === 'status') {
        if (channel.id !== allowedChannelId) {   
            const embed = new EmbedBuilder()
            .setTitle('Vulcanova')
            .setDescription(`Ta komenda może być użyta tylko na kanale <#${allowedChannelId}>`)
            .setColor('#0c79c7')
            .setTimestamp()
            .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const now = Date.now();
        if (cooldown.has('status')) {
            const lastUsageTime = cooldown.get('status');
            const elapsed = now - lastUsageTime;
            const remainingTime = Math.max(0, cooldownTime - elapsed);
        
            if (remainingTime > 0) {
                const remainingMinutes = Math.floor(remainingTime / 60000);
                const remainingSeconds = Math.ceil((remainingTime % 60000) / 1000);
    
                let remainingTimeString = '';
                if (remainingMinutes > 0) {
                    remainingTimeString += `${remainingMinutes}m `;
                }
                if (remainingSeconds > 0 || remainingMinutes === 0) {
                    remainingTimeString += `${remainingSeconds}s`;
                }
                const embed = new EmbedBuilder()
                .setTitle('Vulcanova')
                .setDescription(`Musisz odczekać jeszcze ${remainingTimeString} przed ponownym użyciem tej komendy`)
                .setColor('#0c79c7')
                .setTimestamp()
                .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
        }
        cooldown.set('status', now);

        const embed = new EmbedBuilder()
        .setTitle('Status dziennika')
        .setColor('#0c79c7')
        .setTimestamp()
        .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });  
    
    const sprawdzenieField = Object.entries(urlToNameMap)
        .map(([name]) => `${waitingicon} - ${name}`)
        .join('\n');
    
    embed.addFields({
        name: 'Sprawdzenie:',
        value: sprawdzenieField
    });
    
    embed.addFields({
        name: 'Legenda:',
        value: legenda
    });
    
    const initialResponse = await interaction.reply({ embeds: [embed], ephemeral: false });
    
    const checkAndDisplayStatus = async (url, results) => {
        try {
            const response = await axios.get(url, { timeout: 60000 });
            console.log(`Requested: ${url} Response:`, response.status);
            const status = response.status === 200;
            results.push({ url, status, reason: workingicon });
        } catch (error) {
            console.log(`Requested: ${url} Response:`, error.message);
            if (error.code === 'ETIMEDOUT') {
                results.push({ url, status: false, reason: timedouticon });
            } 
            else
            {
                results.push({ url, status: false, reason: notworkingicon }); 
            }
        }
    };
    
    const results = [];
    const updateEmbed = async () => {
        const waitingUrls = urlsToCheck.filter(url => !results.some(result => result.url === url));
        const workingUrls = results.filter(result => result.status);
        const notWorkingUrls = results.filter(result => !result.status);
    
        const updatedEmbed = new EmbedBuilder()
            .setTitle('Status dziennika')
            .setColor('#0c79c7')
            .setTimestamp()
            .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });
    
        if (waitingUrls.length > 0) {
            const waitingField = waitingUrls
                .sort((a, b) => urlsToCheck.indexOf(a) - urlsToCheck.indexOf(b))
                .filter(url => urlToNameMap[url])
                .map(url => `${waitingicon} - ${urlToNameMap[url]}`)
                .join('\n');
            updatedEmbed.addFields({ name: 'Sprawdzenie:', value: waitingField });
        }
    
        if (workingUrls.length > 0) {
            const workingField = workingUrls
                .sort((a, b) => urlsToCheck.indexOf(a.url) - urlsToCheck.indexOf(b.url))
                .filter(result => urlToNameMap[result.url])
                .map(result => `${result.reason} - ${urlToNameMap[result.url]}`)
                .join('\n');
            updatedEmbed.addFields({ name: 'Działające usługi:', value: workingField });
        }
    
        if (notWorkingUrls.length > 0) {
            const notWorkingField = notWorkingUrls
                .sort((a, b) => urlsToCheck.indexOf(a.url) - urlsToCheck.indexOf(b.url))
                .filter(result => urlToNameMap[result.url])
                .map(result => `${result.reason} - ${urlToNameMap[result.url]}`)
                .join('\n');
            updatedEmbed.addFields({ name: 'Błędy:', value: notWorkingField });
        }
    
        updatedEmbed.addFields({
            name: 'Legenda:',
            value: legenda
        });
    
        await initialResponse.edit({ embeds: [updatedEmbed] });
    };
    
    await Promise.all(
        urlsToCheck.map(async (url) => {
            await checkAndDisplayStatus(url, results);
            await updateEmbed();
        })
    );
    
    const finalEmbed = new EmbedBuilder()
        .setTitle('Status dziennika')
        .setColor('#0c79c7')
        .setTimestamp()
        .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });
    
    const finalWorkingUrls = results.filter((result) => result.status);
    const finalNotWorkingUrls = results.filter((result) => !result.status);

    if (finalWorkingUrls.length > 0) {
        const workingField = finalWorkingUrls
            .sort((a, b) => urlsToCheck.indexOf(a.url) - urlsToCheck.indexOf(b.url)) 
            .filter(result => urlToNameMap[result.url])
            .map(result => `${result.reason} - ${urlToNameMap[result.url]}`)
            .join('\n');
            finalEmbed.addFields({ name: 'Działające usługi:', value: workingField });
    }

    if (finalNotWorkingUrls.length > 0) {
        const notWorkingField = finalNotWorkingUrls
            .sort((a, b) => urlsToCheck.indexOf(a.url) - urlsToCheck.indexOf(b.url)) 
            .filter(result => urlToNameMap[result.url])
            .map(result => `${result.reason} - ${urlToNameMap[result.url]}`)
            .join('\n');
            finalEmbed.addFields({ name: 'Błędy:', value: notWorkingField });
    }

    finalEmbed.addFields({
        name: 'Legenda:',
        value: legenda
    });
    
    await initialResponse.edit({ embeds: [finalEmbed] });
    }

  });
  
client.login(config_token);
