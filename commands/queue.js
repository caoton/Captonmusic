module.exports = {
  name: "queue",
  description: "Mostrar a fila de músicas e agora em reprodução.",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("Não há nada tocando.").catch(console.error);
    return message
      .reply(
        `📃 **Fila de músicas**

${serverQueue.songs.map((song, index) => index + 1 + ". " + song.title).join("\n")}

Now playing: **${serverQueue.songs[0].title}**
		`,
        { split: true }
      )
      .catch(console.error);
  }
};
