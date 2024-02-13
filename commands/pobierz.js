const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pobierz')
        .setDescription('Link do pobrania Vulcanovy na IOS'),
    async execute(interaction, client) {
            const embed = new EmbedBuilder()
            .setTitle('Vulcanova na AppStore')
            .setDescription('Aplikacja Vulcanova jest już dostępna na AppStore i możesz ją pobrać klikając w ten link: [AppStore](https://apps.apple.com/pl/app/vulcanova/id6451334441)')
            .setColor('#0c79c7')
            .addFields({ name: 'Vulcanova Beta', value: 'Jeśli chcesz uczestniczyć w testowaniu aplikacji Vulcanova na platformie Testflight to skorzystaj z tego linku: [TestFlight](https://testflight.apple.com/join/fGMjqr58)'})
            .setTimestamp()
            .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
