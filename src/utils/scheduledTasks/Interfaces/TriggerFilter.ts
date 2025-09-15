import { Client, TextChannel } from "discord.js";
import { ScheduledEventDocument, ScheduledEventType } from "../../../models/ScheduledEvent";

export interface TriggerFilter {
  filter: (
    client: Client,
    evt: ScheduledEventDocument
  ) => Promise<boolean> | boolean;
}