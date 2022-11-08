const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription(
      "Generates an insult or insults someone (format: /insult <engine> <user>)"
    )
    .addStringOption((option) =>
      option
        .setName("engine")
        .setDescription("The engine to use for the insult")
        .addChoices(
          { name: "formula", value: "formula" }, // default
          { name: "shakespearean", value: "shakespearean" },
          { name: "evil", value: "evil" }
        )
    )
    .addUserOption((option) => option.setName("user").setDescription("User to insult")),
  async execute(interaction) {
    console.log("\n'/insult' command executed");
    await interaction.deferReply();

    function dataToList(data) {
      return data
        .split("\n")
        .map((word) =>
          word
            .replace(/(\r\n|\n|\r)/gm, "")
            .trim()
            .toLowerCase()
        )
        .filter((word) => word != "");
    }
    function randomWord(lst) {
      return lst[Math.floor(Math.random() * lst.length)];
    }
    function readShakespeareanInsults(path) {
      const data = fs.readFileSync(path, "utf8");
      const lines = data.split("\n");
      let columns = { first: [], second: [], third: [] };
      for (const line of lines) {
        const words = line.split(/\s+/).map((word) =>
          word
            .replace(/(\r\n|\n|\r)/gm, "")
            .trim()
            .toLowerCase()
        );
        columns.first.push(words[0]);
        columns.second.push(words[1]);
        columns.third.push(words[2]);
      }
      return columns;
    }

    const engine = interaction.options.getString("engine") ?? "formula";
    const user = interaction.options.getUser("user");
    console.log({ engine, user });
    let insult = "";
    let userInsult = "";

    try {
      switch (engine) {
        case "formula":
          const adverbsData = fs.readFileSync("./words/adverbs.txt", "utf8");
          const gerundsData = fs.readFileSync("./words/gerunds.txt", "utf8");
          const colorsData = fs.readFileSync("./words/colors.txt", "utf8");
          const animalsData = fs.readFileSync("./words/animals.txt", "utf8");

          const adverbs = dataToList(adverbsData);
          const gerunds = dataToList(gerundsData);
          const colors = dataToList(colorsData);
          const animals = dataToList(animalsData);

          const adverb = randomWord(adverbs);
          const gerund = randomWord(gerunds);
          const color = randomWord(colors);
          const animal = randomWord(animals);
          console.log({ adverb, gerund, color, animal });

          insult = `${adverb} ${gerund} ${color} ${animal}`;
          userInsult = `you ${insult}!`;
          break;
        case "shakespearean":
          const columns = readShakespeareanInsults("./words/shakespeare.txt");

          const first = randomWord(columns.first);
          const second = randomWord(columns.second);
          const third = randomWord(columns.third);
          console.log({ first, second, third });

          insult = `${first} ${second} ${third}`;
          userInsult = `thou ${insult}!`;
          break;
        case "evil":
          const data = await axios
            .get("https://evilinsult.com/generate_insult.php?lang=en&type=json")
            .then((response) => response.data);
          console.log(data);

          insult = "\n" + data.insult;
          userInsult = data.insult;
          break;
      }
      console.log({ insult, userInsult }, "\n");
      if (user) {
        await interaction.editReply(user.toString() + ", " + userInsult);
      } else {
        await interaction.editReply("Insult generated: " + insult);
      }
    } catch (error) {
      console.error("\nError during 'insult' command:\n");
      console.error(error);
      await interaction.editReply("Error during 'insult' command");
    }
  },
};
