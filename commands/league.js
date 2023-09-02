const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("league")
    .setDescription(
      "League builds or counters (format: /league <engine> <champion> <type> <role> <opponent>)"
    )
    .addStringOption((option) =>
      option
        .setName("engine")
        .setDescription("Which website to use for builds (default: u.gg)")
        .addChoices(
            { name: "u.gg", value: "u.gg" },
            { name: "leagueofgraphs.com", value: "leagueofgraphs.com" }
        )
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
        .setDescription("(only relevant if type=build and champion is specified) (default: most popular or all)")
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

    const engine = interaction.options.getString("engine") ?? "u.gg";
    const champion = removeAllNonLetters(interaction.options.getString("champion") ?? "");
    const type = interaction.options.getString("type") ?? "build";
    const role = interaction.options.getString("role") ?? "";
    const opponent = removeAllNonLetters(interaction.options.getString("opponent") ?? "");

    if (champion == "") {
        const noChampionLinkUgg = `<https://u.gg/lol/tier-list>`;
        const noChampionLinkLog = `<https://www.leagueofgraphs.com/champions/builds/by-winrate>`;
        if (engine == "u.gg") {
            await interaction.reply(`League builds from U.GG:\n${noChampionLinkUgg}`);
        } else {
            await interaction.reply(`League builds from League Of Graphs:\n${noChampionLinkLog}`);
        }
        return;
    }

    let linkString = "";
    if (engine == "u.gg") {
        const linkStringBase = `<https://u.gg/lol/champions/${champion}/${type}`;
        linkString = linkStringBase;

        if (type == "build") {
            if (role != "") {
                linkString += `/${role}`;
            }
            if (opponent != "") {
                linkString += `?opp=${opponent}`;
            }
        }
        linkString += `>`;
    } else {
        const linkStringBase = `<https://www.leagueofgraphs.com/champions/${type}s/${champion}`;
        linkString = linkStringBase;

        if (type == "build") {
            if (role != "") {
                linkString += `/${role}`;
            }
            if (opponent != "") {
                linkString += `/${opponent}`;
            }
        }
        linkString += `>`;
    }


    let output = engine == "u.gg" ? "U.GG " : "League Of Graphs ";
    if (type == "build") {
        output += `builds for `;
        if (role != "") {
            output += `${role} `;
        }
        output += `${champion}`;
        if (opponent != "") {
            output += ` vs ${opponent}`;
        }
    } else {
        output += `counters for ${champion}`;
    }
    output += `:\n${linkString}`;

    await interaction.reply(output);
  },
};
