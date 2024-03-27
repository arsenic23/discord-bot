const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("powiadomienia")
    .setDescription("Informacja dotycząca powiadomień w aplikacji"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Powiadomienia w Vulcanovej")
      .setDescription(
        "Powiadomień natychmiastowych (takich jak w oficjalnej aplikacji) raczej nie będzie. Aby aplikacja mogła otrzymywać takie powiadomienia, musiałaby udowodnić serwerom, że jest oficjalną aplikacją, co jest bardzo trudne lub nawet niemożliwe. Pozostaje zatem opcja powiadomień wyzwalanych okresowo. Aplikacja by zlecała iOSowi uruchomienie procesu synchronizacji danych co jakiś czas w tle. W tym podejściu mogłoby się pojawić jakieś opóźnienie (czasami nawet kilkugodzinne) pomiędzy pojawieniem się danych w systemie Vulcan UONET+, a otrzymaniem powiadomienia. To iOS decyduje, jak często uruchamia procesy w tle. W przeciwieństwie do Androida, gdzie aplikacja może określić co jaki czas ma być proces uruchamiany. Tak więc jeśli powiadomienia się pojawią, to raczej będzie to ta opcja.",
      )
      .setColor("#0c79c7")
      .setTimestamp()
      .setFooter({
        text: "Vulcanova",
        iconURL: client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
