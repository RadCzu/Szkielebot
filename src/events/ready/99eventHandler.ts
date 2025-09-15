import { Client, TextChannel } from "discord.js";
import ScheduledEventModel, { ScheduledEventDocument } from "../../models/ScheduledEvent";
import { DailyPingAss } from "../../utils/scheduledTasks/dailyPingAss";
import { PingAmelka } from "../../utils/scheduledTasks/pingAmelka";
import { ScheduledEventFunction } from "../../utils/scheduledTasks/Interfaces/ScheduledEventHelper";

// Local registry
const eventHandlers: Record<string, ScheduledEventFunction> = {
  pingAmelka: new PingAmelka(),
};

// Main async loop function
export async function startScheduledEventsLoop(client: Client) {
  console.log("✅ Scheduled events loop started");

  setInterval(async () => {
    try {
      const events: ScheduledEventDocument[] = await ScheduledEventModel.find({});
      const existingIds = new Set(events.map(e => e.eventId));

      // Handle existing events
      for (const evt of events) {
        const handler = eventHandlers[evt.eventId];
        if (!handler) continue;

        try {
          await handler.execute(client, evt);
        } catch (err) {
          console.error(`Error executing event ${evt.eventId}:`, err);
        }
      }

      // Auto-create missing events
      for (const [eventId, handler] of Object.entries(eventHandlers)) {
        if (!existingIds.has(eventId)) {
          const [firstGuild] = client.guilds.cache.values();
          if (!firstGuild) continue;

          const defaultChannelId = "1412540951422959638";
          const newEvent = new ScheduledEventModel({
            guildId: firstGuild.id,
            channelId: defaultChannelId,
            eventId,
            time: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
          });

          await newEvent.save();
          console.log(`📌 Created new scheduled event ${eventId} in guild ${firstGuild.name}`);

          // Run immediately once after creation
          await handler.execute(client, newEvent);
        }
      }
    } catch (err) {
      console.error("Error in scheduled events loop:", err);
    }
  }, 5 * 60 * 1000); // every 5 minutes
}
