const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("remind")
		.setDescription("Reminds you of something! (format: /remind [time] [unit] [message])")
		.addNumberOption(option =>
			option.setName("time")
				.setDescription("The amount of time to wait before reminding you")
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName("unit")
				.setDescription("The unit of time")
				.setRequired(true)
				.addChoices(
					{ name: "seconds", value: 1 },
					{ name: "minutes", value: 60 },
					{ name: "hours", value: 3600 },
					{ name: "days", value: 86400 },
					{ name: "weeks", value: 604800 },
				))
		.addStringOption(option =>
			option.setName("message")
				.setDescription("The message to remind you of")),
	async execute(interaction) {
		console.log("\n'/remind' command executed");

		await interaction.deferReply();

		const time = interaction.options.getNumber("time");
		const unitModifier = interaction.options.getInteger("unit");
		const message = interaction.options.getString("message") ?? "You asked me to remind you of something!";

		const delay = Math.round(unitModifier * time * 1000);

		console.log({ time, unitModifier, message, delay }, "\n");

		const unitString = {
			1: "seconds",
			60: "minutes",
			3600: "hours",
			86400: "days",
			604800: "weeks",
		}[unitModifier];
		const successMessage = "Reminder set for " + time + " " + unitString + " from now:\n" + message;
		await interaction.editReply(successMessage);


		async function reminder() {
			await interaction.editReply("\n**REMINDER:**\n" + message);
		}

		setTimeout(() => reminder(), delay);
	},
};