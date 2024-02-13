const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('android')
        .setDescription('Informacja dotycząca wersji na android'),
    async execute(interaction, client) {
            const embed = new EmbedBuilder()
            .setTitle('Vulcanova na Androidzie')
            .setDescription('Niestety, Vulcanova na Androidzie może się nigdy nie pojawić. Wynika to z kilku przyczyn. Najważniejszą jest brak czasu — Vulcanova to projekt tworzony po godzinach i nie ma czasu na napisanie praktycznie całej aplikacji od nowa.')
            .setColor('#0c79c7')
            .addFields({ name: 'Alternatywna aplikacja', value: 'Możesz zapoznać się z aplikacją naszej zaprzyjaźnionej konkurencji — Wulkanowy, która dostępna jest na Androidzie! Dołącz na jej serwer Discord używając tego [linku](https://discord.gg/Uk3pgVSB2y).'})
            .setTimestamp()
            .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
