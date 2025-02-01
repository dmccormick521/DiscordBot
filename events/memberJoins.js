const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {Events} = require('discord.js');
const {createReadStream} = require('fs')
const {guildId} = require('../config.json');
const { getAudioPreference } = require('../database/db');

// In-memory cache to track the last time a user played audio
const userLastAudioTimestamp = new Map();

// Set delay time (in milliseconds)
const DELAY_TIME = 5000; // 5 seconds

module.exports = {
name: Events.VoiceStateUpdate,
async execute(oldState, newState) {

    if(newState.guild.id != guildId) return;

    const currentTime = Date.now();

    const userId = newState.member.id

    const lastPlayedTime = userLastAudioTimestamp.get(userId);

    if (lastPlayedTime && currentTime - lastPlayedTime < DELAY_TIME) {
        const timeRemaining = DELAY_TIME - (currentTime - lastPlayedTime);
        const secondsRemaining = Math.ceil(timeRemaining / 1000);
        console.log(`User ${userId} has to wait ${secondsRemaining} seconds before audio can be played.`);
        return;
    }

    if(!oldState.channelId && newState.channelId){
        const channel = newState.guild.channels.cache.get(newState.channelId);
        if(!channel) {
            return;
        };



        try {
            // Get user audio preference from the database
            const { found, audioFile } = await getAudioPreference(userId);

            if (!found) {
                console.log(`No custom audio set for user ${userId}`);
                return; // If no audio preference found, exit
            }

            // If audio preference exists, play it
            const audioFilePath = audioFile;
            const audioFileStream = createReadStream(audioFilePath);

            if (!channel) return;

            // Join the voice channel
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: newState.guild.id,
                adapterCreator: newState.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            const audioResource = createAudioResource(audioFileStream, {
                inlineVolume: true
            });

            audioResource.volume.setVolume(0.3); // Adjust volume

            player.play(audioResource);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy(); // Destroy connection when audio is finished
            });

            connection.subscribe(player); // Subscribe the player to the voice channel

            // Update the timestamp of the last audio played
            userLastAudioTimestamp.set(userId, currentTime);

            console.log(`Playing custom audio for user ${userId}`);
        } catch (error) {
            console.error('Error fetching or playing audio:', error);
        }
    }
}
}