const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription(
      "Reminds you of something (format: /remind [time] [unit] <user> <message>)"
    )
    .addNumberOption((option) =>
      option
        .setName("time")
        .setDescription("The amount of time to wait before reminding you")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("unit")
        .setDescription("The unit of time")
        .setRequired(true)
        .addChoices(
          { name: "seconds", value: 1 },
          { name: "minutes", value: 60 },
          { name: "hours", value: 3600 },
          { name: "days", value: 86400 },
          { name: "weeks", value: 604800 }
        )
    )
    .addUserOption((option) => option.setName("user").setDescription("Tags the user when the reminder is sent"))
    .addStringOption((option) =>
      option.setName("message").setDescription("The message to remind you of")
    ),
  async execute(interaction) {
    console.log("\n'/remind' command executed");

    const time = interaction.options.getNumber("time");
    const unitModifier = interaction.options.getInteger("unit");

    const user = interaction.options.getUser("user");

    const defaultMessage = "You asked me to remind you of something!";
    const message = interaction.options.getString("message") ?? defaultMessage;

    const delay = Math.round(unitModifier * time * 1000);

    console.log({ time, unitModifier, message, delay }, "\n");

    const unitStrings = {
      1: "seconds",
      60: "minutes",
      3600: "hours",
      86400: "days",
      604800: "weeks",
    };
    let successMessage =
      "Reminder set for " + time + " " + unitStrings[unitModifier] + " from now";
    if (message == defaultMessage) {
      successMessage += ".";
    } else {
      successMessage += ":\n*" + message + "*";
    }
    await interaction.reply(successMessage);

    const fromDate = new Date();

    async function reminder() {
      const nowDate = new Date();

      let timeString = fromDate.toTimeString().substring(0, 5);
      if (timeString.startsWith("0")) {
        timeString = timeString.substring(1);
      }

      const dateString = fromDate.toDateString();
      const nowDateString = nowDate.toDateString();
      if (dateString != nowDateString) {
        timeString += " on " + dateString.substring(0, 10);
      }
      
      let bonusString = "";
      if (user) {
        bonusString = " to " + user.toString();
      }

      await interaction.channel.send(
        "**REMINDER**" + bonusString + " (from " + timeString + "):\n*" + message + "*"
      );
    }

    setTimeout(() => reminder(), delay);
  },
};
