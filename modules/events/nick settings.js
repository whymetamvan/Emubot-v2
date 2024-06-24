const config = require('../data/config.json');

module.exports = {
  name: 'ready',
  execute(client) {
    client.guilds.cache.forEach(guild => {
      guild.members.fetch(client.user.id)
        .then(member => {
          const nickname = config.nickname; 
          member.setNickname(nickname)
            .catch(error => console.error(`${guild.name}のニックネームの変更失敗`));
        });
    });

    client.user.setStatus('online');
   setInterval(() => {
　　　　 const activities = ["えむbotだよ！", "/youtube-playを実装"];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(randomActivity);
      }, 10000);
  }
};
