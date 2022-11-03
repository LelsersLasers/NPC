const { Events } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		console.log("\nTIME:", new Date(), "\nInteraction found from", interaction.user.username);

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		console.log("Command found:", command);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			console.log("Executing command:", command.data.name, "\n");
			await command.execute(interaction);
		} catch (error) {
			console.error("\nError executing", interaction.commandName, "\n", error);
		}
	},
};