const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription(
      "Generates an insult or insults someone (format: /insult [user])"
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User to insult")
    ),
  async execute(interaction) {
    console.log("\n'/insult' command executed");

    function dataToList(data) {
      return data
        .split("\n")
        .map((word) => word.replace(/(\r\n|\n|\r)/gm, "").trim())
        .filter((word) => word != "");
    }
    function randomWord(lst) {
      return lst[Math.floor(Math.random() * lst.length)];
    }

    const user = interaction.options.getUser("user");

    await interaction.deferReply();
    try {
      const colorsData = fs.readFileSync("./words/colors.txt", "utf8");
      const nounsData = fs.readFileSync("./words/nouns.txt", "utf8");
      const adjectivesData = fs.readFileSync("./words/adjectives.txt", "utf8");

      const colors = dataToList(colorsData);
      const nouns = dataToList(nounsData);
      const adjectives = dataToList(adjectivesData).filter(
        (adjective) => !colors.includes(adjective)
      );

      const color = randomWord(colors);
      const noun = randomWord(nouns);
      const adjective = randomWord(adjectives);
      console.log({ color, adjective, noun });

      const insult = color + " " + adjective + " " + noun;

      if (user) {
        await interaction.editReply(user.toString() + ", you " + insult + "!");
      } else {
        await interaction.editReply("Insult generated: " + insult);
      }
    } catch (error) {
      console.error("\nError reading files for insult command:\n");
      console.error(error);
      await interaction.editReply("Error reading files for insult command");
    }
  },
};
