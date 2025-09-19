import { CommandTemplate } from "../../models/Command";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  VoiceConnection,
  VoiceConnectionStatus,
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
    // helper function
    const safeDestroy = (connection: VoiceConnection, channelName?: string) => {
      if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
        connection.destroy();
        if (channelName) console.log(`Left the voice channel ${channelName}`);
      }
    };

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
      safeDestroy(connection);
      return interaction.reply("❌ Could not find the sound file.");
    }

    const resource = createAudioResource(filePath);

    // Play after 1 second
    setTimeout(() => player.play(resource), 1000);

    player.on("error", (err) => {
      console.error("Audio player error:", err.message);
    });

    // Leave after 5 seconds
    setTimeout(() => safeDestroy(connection, voiceChannel.name), 5000);

    await interaction.reply(`▶️ Playing test sound in **${voiceChannel.name}**`);
  },
};

export default testSound;
