const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "Pings someone to get their attention (format: /ping [user] [times] [interval] [message])"
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to ping").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("times")
        .setDescription("The amount of times to ping the user (default 3)")
        .setMinValue(1)
    )
    .addNumberOption((option) =>
      option
        .setName("interval")
        .setDescription(
          "The amount of time (in seconds) to wait between pings (default 5)"
        )
        .setMinValue(1)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Any extra things to include with the ping")
    ),
  async execute(interaction) {
    console.log("\n'/ping' command executed");

    const user = interaction.options.getUser("user");
    const times = interaction.options.getInteger("times") ?? 3;
    const interval = interaction.options.getNumber("interval") ?? 5;
    const intervalMs = Math.round(interval * 1000);
    const message = interaction.options.getString("message") ?? "";

    const username = user.username;
    console.log({ username, times, interval, message }, "\n");

    let messageString = user.toString();
    if (message != "") {
      messageString += ": " + message;
    }

    await interaction.reply(
      "Pinging " +
        user.toString() +
        " " +
        times +
        " times with " +
        interval +
        " second intervals..."
    );

    async function ping(timesLeft) {
      if (timesLeft > 0) {
        await interaction.channel.send(messageString);
        setTimeout(() => ping(timesLeft - 1), intervalMs);
      }
    }

    setTimeout(() => ping(times), intervalMs);
  },
};
