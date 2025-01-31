const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('movienight')
		.setDescription('Gives back a movie recommendation!'),
	async execute(interaction) {
		await interaction.reply('Pong!'); //WIP
	},
};