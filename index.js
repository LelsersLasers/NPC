const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config();

// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require("discord.js");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// Load commmand scripts from ./commmands/ ------------------------------------------ //
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}
// ---------------------------------------------------------------------------------- //

// Load on event scripts from ./events/ --------------------------------------------- //
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}
// ---------------------------------------------------------------------------------- //

// Log in to Discord with your client"s token --------------------------------------- //
const token = process.env.DISCORD_TOKEN;
client.login(token);
// ---------------------------------------------------------------------------------- //
