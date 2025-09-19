import { Client, VoiceChannel } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  VoiceConnection,
} from "@discordjs/voice";
import { ScheduledEventFunction } from "./Interfaces/ScheduledEventHelper";
import { ScheduledEventDocument } from "../../models/ScheduledEvent";
import { TimerFilter } from "./filters/TimerFilter";
import path = require("path");
import fs = require("fs");

export class BadToTheBone extends ScheduledEventFunction {
  constructor() {
    super("bad2thebone", [
      new TimerFilter(10), // every 10 minutes
    ]);
  }

  protected async executeInternal(client: Client, evt: ScheduledEventDocument): Promise<void> {
    const channelId = evt.channelId;
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isVoiceBased()) return;
    const voiceChannel = channel as VoiceChannel;

    if (voiceChannel.members.size === 0) return;

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
      console.error("❌ Could not find audio file:", filePath);
      this.safeDestroy(connection);
      return;
    }

    const resource = createAudioResource(filePath);

    // Play after 1 second
    setTimeout(() => player.play(resource), 1000);

    // Leave after 5 seconds
    setTimeout(() => this.safeDestroy(connection, voiceChannel.name), 5000);

    evt.time = new Date();
    await evt.save();
  }

  private safeDestroy(connection: VoiceConnection, channelName?: string) {
    if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
      connection.destroy();
      if (channelName) {
        console.log(`Left the voice channel ${channelName}`);
      }
    }
  }
}

export default new BadToTheBone();
