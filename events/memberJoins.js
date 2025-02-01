const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {Events} = require('discord.js');
const {createReadStream} = require('fs')
const testSoundPath = '../sounds/Strike.mp3';
const path = require('path')
const {guildId} = require('../config.json')

module.exports = {
name: Events.VoiceStateUpdate,
async execute(oldState, newState) {

    if(newState.guild.id != guildId) return;

    if(!oldState.channelId && newState.channelId){
        const channel = newState.guild.channels.cache.get(newState.channelId);
        if(!channel) {
            return;
        };
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: newState.guild.id,
            adapterCreator: newState.guild.voiceAdapterCreator
        })

        const player = createAudioPlayer();
        //eventually swap this to grab AUDIO files from a DB, maybe allow users to choose between a few or set their own
        const audioResource = createAudioResource(createReadStream(path.join(__dirname, testSoundPath)));

        player.play(audioResource);

        player.on(AudioPlayerStatus.Idle, ()=>{
            connection.destroy()
        })

        connection.subscribe(player)
    }
}
}