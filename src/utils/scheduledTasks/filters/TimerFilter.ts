import { Client, TextChannel } from "discord.js";
import { ScheduledEventDocument, ScheduledEventType } from "../../../models/ScheduledEvent";
import { TriggerFilter } from "../Interfaces/TriggerFilter";

/**
 * ⏲️ A filter that only allows the event to run
 * if a given amount of minutes has passed since the last run.
 *
 * @example
 * ```ts
 * const filter = new TimerFilter(60); // runs once per hour
 * ```
 */
export class TimerFilter implements TriggerFilter {
  private interval: number; // ms

  /**
   * @param intervalMinutes Number of minutes that must pass between executions
   */
  constructor(intervalMinutes: number) {
    this.interval = intervalMinutes * 60 * 1000;
  }

  /**
   * Returns true if enough time has passed since the event was last executed.
   */
  async filter(
    _client: Client,
    evt: ScheduledEventDocument
  ): Promise<boolean> {
    const now = Date.now();
    const lastUsed = evt.time?.getTime() ?? 0;
    const diff = now - lastUsed;

    return diff >= this.interval;
  }
}
