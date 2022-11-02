const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		console.log("\n'/ping' command executed\n");
		await interaction.reply("Pong!");
	},
};