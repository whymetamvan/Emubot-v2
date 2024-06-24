module.exports = {
  name: 'ready',
  execute(client) {
    client.guilds.cache.forEach(guild => {
      guild.members.fetch(client.user.id)
        .then(member => {
          member.setNickname('Emu V2')
            .catch(error => console.error(`${guild.name}のニックネームの変更失敗`));
        })
    });

    client.user.setStatus('online');
  }
};
