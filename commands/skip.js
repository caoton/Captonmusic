module.exports = {
  name: "skip",
  description: "Ignorar a música atualmente sendo reproduzida",
  async execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("Você precisa ingressar em um canal de voz primeiro!").catch(console.error);
    if (!serverQueue)
      return message.channel.send("Não há nada que eu possa pular para você.").catch(console.error);

    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(`${message.author} ⏭ pulou a música`).catch(console.error);
  }
};
