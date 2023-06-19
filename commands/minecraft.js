const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, bold, italic, underscore, blockQuote, codeBlock } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription('Gives you the status of the official Ta\'s Hangout SMP'),
  async execute(interaction) {
    const response = await fetch("https://api.mcstatus.io/v2/status/java/51.161.115.36:25574");
    const json = await response.json();
    let send = bold("### Ta's Hangout SMP - " + italic("Hosted by Quimexus"));
    send += `Running: ${bold(json.online ? "Yes" : "No")}\n`;
    send += `Address: ${bold("51.161.115.36:25574")}\n`;
    send += `Version: Java ${bold(json?.version?.name_clean || "n/a")}\n`;
    send += `Players: ${bold(json?.players?.online || "n/a")}\n`;
    send = blockQuote(send);
    const players = new ButtonBuilder()
      .setCustomId('players')
      .setLabel('Show Player List')
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder()
      .addComponents(players);
    const res = await interaction.reply({
      content: send,
      components: [row],
      ephemeral: true
    });
    const collector = res.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });

    collector.on('collect', async i => {
      let newRes = "";
      if (json?.players) {
        if (json.players.list.length == 0) {
          newRes += "Nobody is online <:despair:844284945748328519>";
        } else {
          json.players.list.forEach((player) => {
            newRes += `- ${player.name_clean}\n`;
          })
          newRes = codeBlock(newRes);
        }
        await i.reply({
          content: underscore("### Players\n") + newRes,
          ephemeral: true
        });
      }
    });
  },
};