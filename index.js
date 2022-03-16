const Discord = require('discord.js');
const DiscordModals = require('discord-modals');
const axios = require('axios');

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS]
});

DiscordModals(client);
client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  client.api.applications(client.user.id).guilds(process.env.GUILD_ID).commands.post({
    data: {
      name: 'test',
      description: 'Testing time!'
    }
  });
});

client.on('interactionCreate', (interaction) => {
  if (interaction.type == 'APPLICATION_COMMAND') {
    var components = [{
      type: 1,
      components: [{
        type: 2,
        label: 'Do A Thing',
        style: 1,
        custom_id: `test-MODAL`
      }]
    }];

    interaction.reply({
      ephemeral: true,
      components: components
    }).then(() => {
      interaction.followUp({
        components: components
      });
    });
  } else if (interaction.type == 'MESSAGE_COMPONENT') {
    const modal = new DiscordModals.Modal()
      .setCustomId('test')
      .setTitle('Testing')
      .addComponents(
        new DiscordModals.TextInputComponent()
        .setCustomId('foo')
        .setStyle('SHORT')
        .setLabel('Test')
        .setRequired(true)
      );

    DiscordModals.showModal(modal, {
      client: interaction.client,
      interaction: interaction
    });
  }
});

client.on('modalSubmit', (interaction) => {
  interaction.reply({
    content: 'You did a thing!'
  });
});
