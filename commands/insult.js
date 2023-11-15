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
          { name: "alliteration", value: "alliteration" },
          { name: "shakespearean", value: "shakespearean" },
          { name: "evil", value: "evil" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("pattern")
        .setDescription("av: adverb, g: gerund, c: color (default: av g c a) (only relevant if engine=formula/alliteration)")
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
    function randomWordNotIn(lst, notIn) {
        let word = randomWord(lst);
        if (notIn.includes(word)) {
            return randomWordNotIn(lst, notIn);
        }
        return word;
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

    function generate_formula_insult(pattern) {
      const adverbsData = fs.readFileSync("./words/adverbs.txt", "utf8");
      const gerundsData = fs.readFileSync("./words/gerunds.txt", "utf8");
      const colorsData = fs.readFileSync("./words/colors.txt", "utf8");
      const animalsData = fs.readFileSync("./words/animals.txt", "utf8");

      const adverbs = dataToList(adverbsData);
      const gerunds = dataToList(gerundsData);
      const colors = dataToList(colorsData);
      const animals = dataToList(animalsData);

      const insult_words = [];

      pattern = pattern.split(" ").filter((type) => ["av", "g", "c", "a"].includes(type));
      if (pattern.length == 0) {
        pattern = ["av", "g", "c", "a"];
      }
      for (const type of pattern) {
        switch (type) {
          case "av": insult_words.push(randomWordNotIn(adverbs, insult_words)); break;
          case "g": insult_words.push(randomWordNotIn(gerunds, insult_words)); break;
          case "c": insult_words.push(randomWordNotIn(colors, insult_words)); break;
          case "a": insult_words.push(randomWordNotIn(animals, insult_words)); break;
        }
      }

      return insult_words;
    }


    const engine = interaction.options.getString("engine") ?? "formula";
    const pattern = interaction.options.getString("pattern") ?? "av g c a";
    const user = interaction.options.getUser("user");
    console.log({ engine, user });
    let insult = "";
    let userInsult = "";

    try {
      switch (engine) {
        case "formula":
          const insult_words = generate_formula_insult(pattern);
          insult = insult_words.join(" ");

          userInsult = `you ${insult}!`;
          break;
        case "alliteration":
          while (true) {
            const insult_words = generate_formula_insult(pattern);
            const letter = insult_words[0][0];
            if (insult_words.every((word) => word[0] == letter)) {
              insult = insult_words.join(" ");
              userInsult = `you ${insult}!`;
              break;
            }
          }
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
