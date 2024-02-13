const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Utwórz wiadomość w embedzie')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addStringOption(option =>
            option.setName('zawartosc')
                .setDescription('Opis w embedzie')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tytul')
                .setDescription('Tytuł w embedzie (opcjonalny)')),
    async execute(interaction, client) {

        const title = interaction.options.getString('tytul');
        const description = interaction.options.getString('zawartosc').replace(/\\n/g, '\n');

        const embed = new EmbedBuilder()
            .setDescription(description)
            .setColor("#0c79c7")
            .setTimestamp()
            .setFooter({ text: 'Vulcanova', iconURL: client.user.displayAvatarURL() });

        if (title) {
            embed.setTitle(title);
        }
        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
