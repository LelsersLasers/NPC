const { SlashCommandBuilder } = require("discord.js");
const Ollama = require('ollama');

const model = "gemma2:2b";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("llm")
    .setDescription(
      `Chat with ${model} No history is stored, and the bot will not remember anything you say.`
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
      messages: [{ role: 'user', content: prompt }]
    });

    console.log({ response });
    await interaction.editReply(response.message.content);
  },
};
