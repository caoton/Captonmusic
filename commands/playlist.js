const { play } = require("../include/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "playlist",
  description: "Reproduzir uma lista de reprodução do youtube",
  async execute(message, args) {
    const { channel } = message.member.voice;

    if (!args.length)
      return message.reply("Uso: / playlist <URL da lista de reprodução do YouTube | Nome da lista de reprodução>").catch(console.error);
    if (!channel) return message.reply("Você precisa ingressar em um canal de voz primeiro!").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("não pode se conectar ao canal de voz, faltando permissões");
    if (!permissions.has("SPEAK"))
      return message.reply("Não consigo falar neste canal de voz, verifique se tenho as permissões adequadas!");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const serverQueue = message.client.queue.get(message.guild.id);
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
      }
    }

    videos.forEach(video => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };

      if (serverQueue) {
        serverQueue.songs.push(song);
        message.channel
          .send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
          .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    message.channel
      .send(
        `${message.author} 📃 Added a playlist - **${playlist.title}** <${playlist.url}>

${queueConstruct.songs.map((song, index) => index + 1 + ". " + song.title).join("\n")}
    `,
        { split: true }
      )
      .catch(console.error);

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(`Could not join voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
      }
    }
  }
};
