const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("league")
    .setDescription(
      "League builds or counters (format: /league <champion> <type> <role> <opponent>)"
    )
    .addStringOption((option) =>
      option
        .setName("champion")
        .setDescription("The champion (default: overall)")
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Build or counter (default: build) (only relevant if champion is specified)")
        .addChoices(
            { name: "build", value: "build" },
            { name: "counter", value: "counter" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("(only relevant if type=build and champion is specified) (default: most popular for champion)")
        .addChoices(
            { name: "top", value: "top" },
            { name: "jungle", value: "jungle" },
            { name: "mid", value: "mid" },
            { name: "adc", value: "adc" },
            { name: "support", value: "support" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("opponent")
        .setDescription("The champion you are playing against (only relevant if type=build and champion is specified)")
    ),
  async execute(interaction) {
    console.log("\n'/league' command executed\n");

    function removeAllNonLetters(str) {
        return str.replace(/[^a-zA-Z]/g, "");
    }

    const champion = removeAllNonLetters(interaction.options.getString("champion") ?? "");
    const type = interaction.options.getString("type") ?? "build";
    const role = interaction.options.getString("role") ?? "";
    const opponent = removeAllNonLetters(interaction.options.getString("opponent") ?? "");

    const noChampionLink = `<https://u.gg/lol/tier-list>`;
    if (champion == "") {
        await interaction.reply(`League builds:\n${noChampionLink}`);
        return;
    }


    const linkStringBase = `<https://u.gg/lol/champions/${champion}/${type}>`;
    let linkString = linkStringBase;

    if (type == "build") {
        if (role != "") {
            linkString += `/${role}`;
        }
        if (opponent != "") {
            linkString += `?opp=${opponent}`;
        }
    }


    let output = "";
    if (type == "build") {
        output += `Builds for `;
        if (role != "") {
            output += `${role} `;
        }
        output += `${champion}`;
        if (opponent != "") {
            output += ` vs ${opponent}`;
        }
    } else {
        output += `Counters for ${champion}`;
    }
    output += `:\n${linkString}`;

    await interaction.reply(output);
  },
};
