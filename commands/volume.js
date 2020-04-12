module.exports = {
  name: "volume",
  description: "Alterar o volume da voz atualmente em reprodução",
  execute(message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("Você precisa ingressar em um canal de voz primeiro!").catch(console.error);
    if (!serverQueue) return message.reply("Não há nada tocando.").catch(console.error);

    if (!args[0])
      return message.reply(`🔊 o volume atual is: **${serverQueue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Por favor, use um número para definir o volume.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Por favor, use um número entre 0 e 100.").catch(console.error);

    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return serverQueue.textChannel.send(`Volume set to: **${args[0]}%**`).catch(console.error);
  }
};
