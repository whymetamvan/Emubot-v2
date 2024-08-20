// index.js
const client = require('./clients');
require('./modules/events/error');
const miqEvent = require('./modules/events/miq');
miqEvent(client);
const { Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

client.on('ready', () => {
    console.log(`${client.user.tag}、起動！`);
});

client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'modules', 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'modules', 'commands', file));
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync(path.join(__dirname, 'modules', 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(__dirname, 'modules', 'events', file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

