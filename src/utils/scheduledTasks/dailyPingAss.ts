import { Client, TextChannel } from "discord.js";
import { ScheduledEventFunction } from "./Interfaces/ScheduledEventHelper";
import { ScheduledEventDocument } from "../../models/ScheduledEvent";
import { TimerFilter } from "./filters/TimerFilter";

export class DailyPingAss extends ScheduledEventFunction {
  constructor() {
    super("assClean", [
      new TimerFilter(24 * 60), // 24 hours in minutes
    ]);
  }

  protected async executeInternal(client: Client, evt: ScheduledEventDocument): Promise<void> {
    const waldemaeRole = "1411766013154037790";

    // Fetch the channel from the event
    const channel = await client.channels.fetch(evt.channelId);
    if (!channel || !channel.isTextBased()) return;

    await (channel as TextChannel).send(`<@&${waldemaeRole}> Pamiętajcie o myciu dupy!`);

    // Update last execution time in DB
    evt.time = new Date();
    await evt.save();
  }
}

// Export singleton instance
export default new DailyPingAss();
