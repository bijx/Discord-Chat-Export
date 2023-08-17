const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('Bot is online!');

  // Register the slash command
  const commands = [
    new SlashCommandBuilder()
      .setName('chatexport')
      .setDescription('Exports the last N messages from the channel.')
      .addIntegerOption((option) =>
        option
          .setName('limit')
          .setDescription('Number of messages to export')
          .setRequired(true)
      ),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(token);
  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
      rest
        .put(Routes.applicationCommands(clientId), { body: commands })
        .then((data) =>
          console.log(
            `Successfully registered ${data.length} application commands.`
          )
        )
        .catch(console.error);

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'chatexport') {
    const limit = interaction.options.getInteger('limit');

    if (limit < 1) {
      await interaction.reply('The limit must be greater than 0.');
      return;
    }

    // Acknowledge the interaction immediately
    await interaction.deferReply({
      ephemeral: true,
    });

    try {
      const messagesData = [];
      let remaining = limit;
      let lastId;

      while (remaining > 0) {
        const fetchLimit = Math.min(remaining, 100);
        const messages = await interaction.channel.messages.fetch({
          limit: fetchLimit,
          before: lastId,
        });
        remaining -= fetchLimit;

        if (messages.size === 0) break;

        messages.forEach((msg) => {
          messagesData.push({
            content: msg.content,
            author: {
              username: msg.author.username,
              id: msg.author.id,
              bot: msg.author.bot,
            },
            timestamp: msg.createdTimestamp,
            attachments: msg.attachments.map((attach) => ({
              id: attach.id,
              url: attach.url,
              filename: attach.name,
            })),
          });
        });

        lastId = messages.lastKey();
      }

      // Save messagesData to a file
      const filename = `chatexport_${
        interaction.channel.id
      }_${Date.now()}.json`;
      fs.writeFileSync(filename, JSON.stringify(messagesData, null, 2));

      // Edit the original deferred reply with the file attachment
      await interaction.editReply({
        content: 'Here is your chat export:',
        files: [filename],
      });

      fs.unlinkSync(filename);
    } catch (error) {
      console.error(error);
      // If an error occurs, edit the original deferred reply with an error message
      await interaction.editReply({
        content: 'An error occurred while fetching the messages.',
      });
    }
  }
});

client.login(token);
