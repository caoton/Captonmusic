module.exports = {
  name: "loop",
  description: "Alternar loop de música",
  async execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("aqui não tem nada tocando.").catch(console.error);

    // toggle from false to true and reverse
    serverQueue.loop = !serverQueue.loop;
    return serverQueue.textChannel
      .send(`Loop is now ${serverQueue.loop ? "**on**" : "**off**"}`)
      .catch(console.error);
  }
};
