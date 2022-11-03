const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log("\nReady! Logged in as", client.user.tag);
    console.log("COMMANDS:", client.commands, "\n");
  },
};
