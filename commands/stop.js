module.exports = {
  name: "stop",
  description: "Stops the music",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("Você precisa ingressar em um canal de voz primeiro!").catch(console.error);
    if (!serverQueue) return message.reply("Não há nada tocando.").catch(console.error);

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(`${message.author} ⏹ parou a música!`).catch(console.error);
  }
};
