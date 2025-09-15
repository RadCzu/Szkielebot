import { Schema, model, Types, Document } from "mongoose";

export interface ScheduledEventType {
  guildId: string;
  eventId: string;
  channelId: string;
  time: Date;
}

// Document type — tells TS that these are mongoose docs with .save()
export interface ScheduledEventDocument extends ScheduledEventType, Document {}

const scheduledEventSchema = new Schema<ScheduledEventType>({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  eventId: { type: String, required: true },
  time: { type: Date, required: true },
});

const ScheduledEventModel = model<ScheduledEventDocument>(
  "ScheduledEvent",
  scheduledEventSchema
);

export default ScheduledEventModel;
