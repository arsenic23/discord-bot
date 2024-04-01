const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("android")
    .setDescription("Informacja dotycząca wersji na android"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Vulcanova na Androidzie")
      .setDescription(
        "Niestety, obecnie Vulcanova nie posiada wersji na platformę Android. Twórca aplikacji nie ma aktualnie możliwości czasowych, by rozwijać i wspierać wersję na Androida. Chociaż kod na Androida się kompiluje, to aby aplikacja mogła się w ogóle uruchomić i działać poprawnie, trzeba by poświęcić sporą ilość czasu na napisanie brakujących implementacji komponentów. Niestety, ze względu na ograniczenia czasowe, autor nie jest w stanie tego zrobić.",
      )
      .setColor("#0c79c7")
      .addFields({
        name: "Alternatywna aplikacja",
        value:
          "Polecamy aplikację Wulkanowy, która działa na Androidzie. Możesz znaleźć ją w [Google Play](https://play.google.com/store/apps/details?id=io.github.wulkanowy).",
      })
      .setTimestamp()
      .setFooter({
        text: "Vulcanova",
        iconURL: client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
