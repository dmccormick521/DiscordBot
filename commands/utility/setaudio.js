const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // To fetch the file from the URL
const {parseFile} = require('music-metadata')
const { saveAudioPreference } = require('../../database/db'); // Your SQLite connection

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setaudio')
        .setDescription('Upload your own audio file to play when you join a voice channel.')
        .addAttachmentOption(option =>
            option.setName('audio')
                .setDescription('The audio file you want to upload')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const attachment = interaction.options.getAttachment('audio');
        
        // Check if the file is an audio file (based on the file extension)
        const fileExtension = attachment.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['mp3'];
        
        if (!allowedExtensions.includes(fileExtension)) {
            return interaction.reply({ content: 'Please upload a valid audio file (MP3).', flags: 64 });
        }

        // Download the file locally
        const audioPath = path.join(__dirname, '../../sounds', `${userId}-${attachment.name}`);
        const audioStream = fs.createWriteStream(audioPath);

        const audioBuffer = await fetch(attachment.url).then(res => res.buffer());
        audioStream.write(audioBuffer);
        audioStream.end();

        // Check the duration of the audio file before saving it
		try {
            const metadata = await parseFile(audioPath);
            const durationInSeconds = metadata.format.duration; // Duration in seconds
            console.log(`Audio file duration: ${durationInSeconds} seconds`);

            // Reject audio files longer than 3 seconds
            if (durationInSeconds > 3) {
                // Delete the uploaded file since it’s too long
                fs.unlinkSync(audioPath);
                return interaction.reply({ content: 'Your audio file is too long! Please upload a file that is 3 seconds or shorter.', ephemeral: true });
            }

            // Save the file path in the database (now safe to store)
            if (await saveAudioPreference(userId, audioPath)) {
                return interaction.reply({ content: 'Saved successfully', flags: 64 });
            } else {
                return interaction.reply({ content: 'There was an error processing your audio file.', flags: 64 });
            }

        } catch (err) {
            console.error('Error checking audio file duration:', err);
			if (fs.existsSync(audioPath)) {
                fs.unlinkSync(audioPath);
            }
            return interaction.reply({ content: 'There was an error processing your audio file.', flags: 64 });
        }
    },
};
