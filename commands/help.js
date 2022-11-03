const { SlashCommandBuilder } = require("discord.js");

const helpString = `Available commands:
/help - Displays this message
/test - Tests to see if NPC is connected
/ping - Pings someone to get their attention (format: /ping [user] [times] [interval] [message])
/remind - Reminds you of something (format: /remind [time] [message])`;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Tests to see if NPC is connected!"),
	async execute(interaction) {
		console.log("\n'/help' command executed\n");
		await interaction.reply({
			content: helpString,
			ephemeral: true,
		});
	},
};