require('dotenv').config();

const {
  Client,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Missing BOT_TOKEN. Copy .env.example to .env and add your bot token.');
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
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply({ content: 'Pong!', ephemeral: true });
    return;
  }

  if (interaction.commandName === 'purge') {
    if (!interaction.inGuild() || !interaction.channel || !interaction.channel.isTextBased()) {
      await interaction.reply({ content: 'This command can only be used in a server text channel.', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
      await interaction.reply({ content: 'You need the Manage Messages permission to use this command.', ephemeral: true });
      return;
    }

    const botPermissions = interaction.channel.permissionsFor(client.user);
    if (!botPermissions?.has(PermissionFlagsBits.ManageMessages)) {
      await interaction.reply({ content: 'I need the Manage Messages permission in this channel.', ephemeral: true });
      return;
    }

    const amount = interaction.options.getInteger('amount', true);
    await interaction.deferReply({ ephemeral: true });

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.editReply(`Deleted ${deleted.size} recent message${deleted.size === 1 ? '' : 's'}. Messages older than 14 days are skipped by Discord.`);
    } catch (error) {
      console.error('Failed to purge messages:', error);
      await interaction.editReply('I could not delete those messages. Check my channel permissions and try again.');
    }
  }
});

client.login(token);
