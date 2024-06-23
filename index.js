// index.js
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');

const fs = require('fs');
const path = require('path');

// intent
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations, 
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages, 
    GatewayIntentBits.DirectMessageReactions, 
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.User, 
    Partials.Channel, 
    Partials.GuildMember, 
    Partials.Message, 
    Partials.Reaction
  ]
});

// ログイン
client.on('ready', () => {
    console.log(`${client.user.tag}、起動！`);
});

client.login(process.env.token);

// コマンドを読み込む
client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'modules', 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'modules', 'commands', file));
    client.commands.set(command.data.name, command);
}

// イベントを読み込む
const eventFiles = fs.readdirSync(path.join(__dirname, 'modules', 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(__dirname, 'modules', 'events', file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// error
// 未処理のPromiseの拒否をキャッチ
const config = require('./lib/data/config.json');

// 未処理のPromiseの拒否をキャッチ
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  const logChannel = client.channels.cache.get(config.logChannelId);
  if (logChannel) {
    logChannel.send(`Unhandled Rejection at: ${promise}\nReason: ${reason}`);
  }
});

// Discordクライアントのエラーをキャッチ
client.on('error', async (error) => {
  console.error('Discord client error:', error);
  const logChannel = client.channels.cache.get(config.logChannelId);
  if (logChannel) {
    logChannel.send(`Discord client error: ${error.message}`);
  }
});
