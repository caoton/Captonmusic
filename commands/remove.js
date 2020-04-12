module.exports = {
  name: "remove",
  description: "Remover música da fila",
  async execute(message, args) {
    if (!args.length) return message.reply("Uso: / remove <Número da Fila>");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("Não há fila.").catch(console.error);

    const song = serverQueue.songs.splice(args[0] - 1, 1);
    serverQueue.textChannel.send(`${message.author} ❌ removed **${song[0].title}** from the queue.`);
  }
};
