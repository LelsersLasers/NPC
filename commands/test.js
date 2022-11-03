const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Tests to see if NPC is connected!"),
  async execute(interaction) {
    console.log("\n'/test' command executed\n");
    await interaction.reply({
      content: "NPC is connected!",
      ephemeral: true,
    });
  },
};
