require('dotenv').config();
const { Client, Partials, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations, 
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.User, 
    Partials.Channel, 
    Partials.GuildMember, 
    Partials.Message
  ]
});

client.login(process.env.token);

module.exports = client;
