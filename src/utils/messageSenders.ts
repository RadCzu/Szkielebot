import { Client, Message, TextChannel } from "discord.js";

/**
 * Splits a message into chunks of up to 2000 characters,
 * making sure not to cut words in half.
 */
function splitMessage(text: string, maxLength = 2000): string[] {
  const result: string[] = [];
  let current = "";

  for (const word of text.split(" ")) {
    if ((current + word).length + 1 > maxLength) {
      result.push(current.trim());
      current = word + " ";
    } else {
      current += word + " ";
    }
  }

  if (current.trim().length > 0) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Sends a long message into a channel.
 */
export async function sendToChannel(channel: TextChannel, text: string): Promise<void> {
  const chunks = splitMessage(text);
  for (const chunk of chunks) {
    await channel.send(chunk);
  }
}

/**
 * Replies to a message, splitting if needed.
 * The first chunk is a reply, the rest are sent as follow-up messages in the channel.
 */
export async function sendReply(message: Message, text: string): Promise<void> {
  const chunks = splitMessage(text);

  if (chunks.length > 0) {
    await message.reply(chunks[0]); // only first one is a reply
    for (let i = 1; i < chunks.length; i++) {
      await message.channel.send(chunks[i]);
    }
  }
}