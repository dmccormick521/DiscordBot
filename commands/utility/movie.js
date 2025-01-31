// /commands/ask.js
const { SlashCommandBuilder } = require('discord.js');
const {  OPENAI_API_KEY } = require('../../config.json');
const { GoogleGenerativeAI } = require("@google/generative-ai");


const axios = require('axios');

async function getOpenAIResponse(prompt) {
    try {
        const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent('With less than two thousand characters, give me movie recommendations for or based on: ' + prompt);

        return result.response.text();
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        return 'Sorry, something went wrong with the AI request.';
    }
}

module.exports = {
   data: new SlashCommandBuilder()
    .setName('movie')
    .setDescription('Ask for a recommended movie')
    .addStringOption(option =>
        option.setName('query')
            .setDescription('Your question to the AI')
            .setRequired(true)
    ),
    async execute(interaction) {
        const userQuery = interaction.options.getString('query');
        const aiResponse = await getOpenAIResponse(userQuery);
        await interaction.reply(aiResponse);
    },
};
