require('dotenv').config();

const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!BOT_TOKEN || !CLIENT_ID) {
  console.error('Set BOT_TOKEN and CLIENT_ID in your .env file before deploying commands.');
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check whether the bot is responding.'),
  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete a batch of recent messages in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('Number of recent messages to delete (2–100).')
        .setRequired(true)
        .setMinValue(2)
        .setMaxValue(100),
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
const route = GUILD_ID
  ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
  : Routes.applicationCommands(CLIENT_ID);

rest.put(route, { body: commands })
  .then(() => console.log(`Registered ${commands.length} slash commands${GUILD_ID ? ` for guild ${GUILD_ID}` : ' globally'}.`))
  .catch((error) => {
    console.error('Failed to register slash commands:', error);
    process.exitCode = 1;
  });
