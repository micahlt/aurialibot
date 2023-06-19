const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with "pong" to check the bot\'s status.'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};