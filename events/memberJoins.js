const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {Events} = require('discord.js');

module.exports = {
name: Events.VoiceStateUpdate,
async execute(oldState, newState) {

    if(oldState.channelId !== newState.channelId){
        const channel = newState.guild.channels.cache.get(newState.channel);
        if(!channel) return;

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: newState.guild.id,
            adapterCreator: newState.guild.voiceAdapterCreator
        })

        const player = createAudioPlayer();
        //eventually swap this to grab AUDIO files from a DB, maybe allow users to choose between a few or set their own
        const audioResource = createAudioResource(createReadStream('AUDIO PATH'))

        player.play(audioResource);

        player.on(AudioPlayerStatus.Idle, ()=>{
            connection.destroy()
        })

        connection.subscribe(player)
    }
}
}