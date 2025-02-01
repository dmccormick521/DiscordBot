# DiscordBot WIP
It's been quite a while since I've used Visual Studio Code, let's use it while trying to make a discord bot.

# Before Starting

A config.json file will be necessary

{
    "token": "",
    "clientId": "", 
	  "guildId": "",
    "OPENAI_API_KEY": ""
}

clientId is found in the discord developer portal for your bot, under OAuth2 and Client Information.

guildId is found by accessing the developer mode in Discord's setting, right clicking a server icon and copying the server name. (currently being used to push updates only to my specific server)

OPENAI_API_KEY is from https://aistudio.google.com/app/apikey

token is found in the discord developer portal for your bot, under bot. (KEEP SECURE - DO NOT PUSH UP OR DISPLAY)

# How to run

Deploy updates using node deploy-commands.js

Launch using node index.js

Then can interact in server using commands.

# Current Features

/setaudio by supplying an mp3 audio clip that is <=3 seconds, whenever you hop into the server it will play that clip as an 'Intro song' - similar to athletes walk on songs.

/movie by suppling a query, it will formulate it as if you're asking for a movie recommendation and supply you with one or multiple.

/irobot by suppling a query, it will return a generated response.
