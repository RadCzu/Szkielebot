import { CommandTemplate } from "../../models/Command";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} from "@discordjs/voice";
import { VoiceChannel } from "discord.js";
import path = require("path");
import fs = require("fs");

const testSound: CommandTemplate = {
  name: "bad2thebone",
  description: "Play a test sound in a specific voice channel",
  testOnly: true,
  options: [
    {
      name: "channel",
      description: "The voice channel to play the sound in",
      type: 7, // Channel
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const channel = interaction.options.get("channel");
    const voiceChannel = channel?.channel as VoiceChannel;

    if (!voiceChannel || !voiceChannel.isVoiceBased()) {
      return interaction.reply("❌ Please select a valid voice channel.");
    }

    // Join the voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator as any,
    });

    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play },
    });

    connection.subscribe(player);

    const filePath = path.resolve(__dirname, "../../assets/bad2theboneriff.mp3");

    if (!fs.existsSync(filePath)) {
      return interaction.reply("❌ Could not find the sound file.");
    }

    const resource = createAudioResource(filePath);
    setTimeout(() => {
      player.play(resource);
    }, 1000);
    
    player.on("error", (err) => {
      console.error("Audio player error:", err.message);
    });

    // Leave after 5 seconds
    setTimeout(() => {
      connection.destroy();
    }, 5000);

    await interaction.reply(`▶️ Playing test sound in **${voiceChannel.name}**`);
  },
};

export default testSound;
