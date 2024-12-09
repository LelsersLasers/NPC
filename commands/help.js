const { SlashCommandBuilder } = require("discord.js");

const helpString = `Available commands:
/help - displays this message
/test - tests to see if NPC is connected
/ping - pings someone to get their attention (format: /ping [user] <times> <interval> <message>)
/remind - reminds you of something (format: /remind [time] [unit] <user> <message>)
/lineups - searches for Valorant lineups for a agent/map/side (format: /lineup [agent] [map] <side>)
/league - League builds or counters (format: /league [champion] <type> <role> <opponent>)
/insult - generates an insult or insults someone (format: /insult <engine> <user>)
/llm - chat with qwen2.5:0.5b (format: /llm <prompt>)`;

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
