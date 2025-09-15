import { Client, VoiceChannel } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } from "@discordjs/voice";
import { ScheduledEventFunction } from "./Interfaces/ScheduledEventHelper";
import { ScheduledEventDocument } from "../../models/ScheduledEvent";
import { TimerFilter } from "./filters/TimerFilter";
import path = require("path");

export class BadToTheBone extends ScheduledEventFunction {
  constructor() {
    super("bad2thebone", [
      new TimerFilter(10), // every 10 minutes
    ]);
  }

  protected async executeInternal(client: Client, evt: ScheduledEventDocument): Promise<void> {
    const channelId = evt.channelId; // put the voice channel ID in the event
    const channel = await client.channels.fetch(channelId);
    const audio = createAudioResource(path.join(__dirname, "bad-to-the-bone.mp3"));

    if (!channel || !channel.isVoiceBased()) return;
    const voiceChannel = channel as VoiceChannel;

    // If no one is in the channel, skip
    if (voiceChannel.members.size === 0) return;

    // Join the channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator as any,
    });

    // Create audio player
    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    player.play(audio);
    connection.subscribe(player);

    // Leave when finished
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    console.log(`BAD TO THE BONE`);
  }
}

export default new BadToTheBone();
