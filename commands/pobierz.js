const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pobierz")
    .setDescription("Link do pobrania Vulcanovej na iOS"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Vulcanova na App Store")
      .setDescription(
        "[Pobierz aplikację Vulcanova z App Store](https://apps.apple.com/pl/app/vulcanova/id6451334441)",
      )
      .setColor("#0c79c7")
      .addFields({
        name: "Vulcanova Beta",
        value:
          "Lubisz życie na krawędzi? Dołącz do beta testów aplikacji na platformie [TestFlight](https://testflight.apple.com/join/fGMjqr58)",
      })
      .setTimestamp()
      .setFooter({
        text: "Vulcanova",
        iconURL: client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
