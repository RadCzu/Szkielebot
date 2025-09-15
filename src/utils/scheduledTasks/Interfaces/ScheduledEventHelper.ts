import { Client, TextChannel } from "discord.js";
import { ScheduledEventDocument } from "../../../models/ScheduledEvent";
import { TriggerFilter } from "./TriggerFilter";

export abstract class ScheduledEventFunction {
  public readonly eventId: string;
  public readonly filters: TriggerFilter[];

  constructor(eventId: string, filters: TriggerFilter[] = []) {
    this.eventId = eventId;
    this.filters = filters;
  }

  // internal implementation specific to the event
  protected abstract executeInternal(
    client: Client,
    evt: ScheduledEventDocument
  ): Promise<void>;

  // public wrapper (runs filters, then internal)
  public async execute(
    client: Client,
    evt: ScheduledEventDocument
  ): Promise<void> {
    for (const filter of this.filters) {
      const ok = await filter.filter(client, evt);
      if (!ok) {
        return; // skip execution if any filter fails
      }
    }
    await this.executeInternal(client, evt);
  }
}
