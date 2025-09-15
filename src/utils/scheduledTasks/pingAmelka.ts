import { 
  Client, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  TextChannel
} from "discord.js";
import { ScheduledEventFunction } from "./Interfaces/ScheduledEventHelper";
import { ScheduledEventDocument } from "../../models/ScheduledEvent";
import { TimerFilter } from "./filters/TimerFilter";

export class PingAmelka extends ScheduledEventFunction {
  constructor() {
    super("pingAmelka", [new TimerFilter(10)]);
  }

  protected async executeInternal(client: Client, evt: ScheduledEventDocument) {
    const amelka = "607243105409826817";

    // Fetch the channel from the event
    const channel = await client.channels.fetch(evt.channelId);
    if (!channel || !channel.isTextBased()) return;

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("tak").setLabel("TAK").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("nie").setLabel("NIE").setStyle(ButtonStyle.Danger)
    );

    await (channel as TextChannel).send({
      content: `<@${amelka}> Prosze wyjdź za mnie`,
      components: [row],
    });

    // Update last execution time in DB
    evt.time = new Date();
    await evt.save();
  }
}

export default new PingAmelka(); // export an instance
