const { SlashCommandBuilder } = require("discord.js");
const Ollama = require('ollama');

const model = "gwen2.5:0.5b";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("llm")
    .setDescription(
      `Chat with ${model} No history is stored / the bot will not remember anything you say.`
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription(`The prompt to chat with ${model}`)
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log("\n'/llm' command executed");
    await interaction.deferReply();

    const prompt = interaction.options.getString("prompt");

    const ollama = new Ollama.Ollama({ host: 'http://64.98.192.13:11434' });
    const response = await ollama.chat({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    });

    let text = "";
    for await (const part of response) {
      text += part.message.content;
      await interaction.editReply(text);
      console.log({ text });
    }
    cons
  },
};
