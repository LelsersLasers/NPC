const { REST, Routes } = require("discord.js");
// const { clientId, guildId, token } = require("./config.json");
const fs = require("node:fs");

require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command"s data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

// Delete a command ----------------------------------------------------------------- //
// rest.delete(Routes.applicationGuildCommand(clientId, guildId, "1037466531275214948"))
// 	.then(() => console.log("Successfully deleted guild command"))
// 	.catch(console.error);

// for global commands
// rest.delete(Routes.applicationCommand(clientId, "commandId"))
// 	.then(() => console.log("Successfully deleted application command"))
// 	.catch(console.error);