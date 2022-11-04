const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lineups")
    .setDescription(
      "Searches for Valorant lineups for a agent/map/side! (format: /lineup [agent] [map] [side])"
    )
    .addStringOption((option) =>
      option
        .setName("agent")
        .setDescription("The agent")
        .setRequired(true)
        .addChoices(
          { name: "Astra", value: "astra" },
          { name: "Breach", value: "breach" },
          { name: "Brimstone", value: "brimstone" },
          { name: "Chamber", value: "chamber" },
          { name: "Fade", value: "fade" },
          { name: "Harbor", value: "harbor" },
          { name: "Jett", value: "jett" },
          { name: "KAY/O", value: "kayo" },
          { name: "Killjoy", value: "killjoy" },
          { name: "Neon", value: "neon" },
          { name: "Omen", value: "omen" },
          { name: "Phoenix", value: "phoenix" },
          { name: "Raze", value: "raze" },
          { name: "Reyna", value: "reyna" },
          { name: "Sage", value: "sage" },
          { name: "Skye", value: "skye" },
          { name: "Sova", value: "sova" },
          { name: "Viper", value: "viper" },
          { name: "Yoru", value: "yoru" },
          { name: "all agents", value: "all" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("map")
        .setDescription("The map")
        .setRequired(true)
        .addChoices(
          { name: "Ascent", value: "ascent" },
          { name: "Bind", value: "bind" },
          { name: "Breeze", value: "breeze" },
          { name: "Fracture", value: "fracture" },
          { name: "Haven", value: "haven" },
          { name: "Icebox", value: "icebox" },
          { name: "Pearl", value: "pearl" },
          { name: "Split", value: "split" },
          { name: "all maps", value: "all" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("Attacking or defending (default: both)")
        .addChoices(
          { name: "attack", value: "attack" },
          { name: "defense", value: "defense" },
          { name: "both", value: "all" }
        )
    ),
  async execute(interaction) {
    console.log("\n'/lineups' command executed\n");

    const agent = interaction.options.getString("agent");
    const map = interaction.options.getString("map");
    const side = interaction.options.getString("side") ?? "all";

    const linkString = `<https://tracker.gg/valorant/guides/clips?agent=${agent}&map=${map}&objective=${side}&sort=score>`;

    const agentString =
      agent == "all" ? "all agents" : agent.charAt(0).toUpperCase() + agent.slice(1);
    const mapString =
      map == "all" ? "all maps" : map.charAt(0).toUpperCase() + map.slice(1);
    const sideString = side == "all" ? "both sides" : side;

    await interaction.reply(
      `Valorant lineups for ${agentString} on ${mapString} ${sideString}:\n${linkString}`
    );
  },
};
