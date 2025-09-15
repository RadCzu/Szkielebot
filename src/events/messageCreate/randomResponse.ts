import { Client, Message } from "discord.js";
import CiekawostkaModel from "../../models/Ciekawostka";
import { sendReply } from "../../utils/messageSenders";
import { channel } from "diagnostics_channel";

export async function randomCiekawostka(client: Client, message: Message): Promise<void> {
  if (message.author.bot) return;

  if (Math.random() < 0.50) { // 5% chance
    const count = await CiekawostkaModel.countDocuments({ guildId: message.guildId });
    if (count === 0) return;

    const randomIndex = Math.floor(Math.random() * count);
    const fact = await CiekawostkaModel.findOne({ guildId: message.guildId }).skip(randomIndex);

    if (fact) {
      await sendReply(message, fact.text)
    }
  }
}