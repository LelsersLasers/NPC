const { SlashCommandBuilder } = require("discord.js");

const helpString = `Available commands:
/help - displays this message
/test - tests to see if NPC is connected
/ping - pings someone to get their attention (format: /ping [user] <times> <interval> <message>)
/remind - reminds you of something (format: /remind [time] [unit] <message>)
/lineups - searches for Valorant lineups for a agent/map/side (format: /lineup [agent] [map] <side>)
/insult - generates an insult or insults someone (format: /insult <engine> <user>)`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Tests to see if NPC is connected!"),
  async execute(interaction) {
    console.log("\n'/help' command executed\n");
    await interaction.reply({
      content: helpString,
      ephemeral: true,
    });
  },
};
