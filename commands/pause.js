module.exports = {
  name: "pause",
  description: "Pausar a música atualmente sendo reproduzida",
  execute(message) {
    if (!message.member.voice.channel)
      return message.reply("Você precisa ingressar em um canal de voz primeiro!").catch(console.error);

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true);
      return serverQueue.textChannel.send(`${message.author} ⏸ pausou a música.`).catch(console.error);
    }
    return message.reply("Não há nada tocando.").catch(console.error);
  }
};
