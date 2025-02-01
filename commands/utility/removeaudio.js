const { SlashCommandBuilder } = require('@discordjs/builders')
const {
    getAudioPreference,
    deleteAudioPreference,
} = require('../../database/db') // Your SQLite connection

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeaudio')
        .setDescription(
            'Remove your own audio file that would play when you join a voice channel.'
        ),

    async execute(interaction) {
        const userId = interaction.user.id
        try {
            // Get user audio preference from the database
            const { found } = await getAudioPreference(userId)

            if (!found) {
                console.log(`No custom audio set for user ${userId}`)
                return // If no audio preference found, exit
            } else {
                const deleteStatus = await deleteAudioPreference(userId)
                if (!deleteStatus) {
                    console.error(
                        `Audio file deletion issue for user ${userId}`
                    )
                    return
                }

                console.log(`Audio file deleted for user ${userId}`)
                return
            }
        } catch (error) {
            console.error('Error fetching or deleting audio:', error)
        }
    },
}