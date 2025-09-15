import { Client, Interaction } from "discord.js";

export async function handleButtonInteractions(client: Client, interaction: Interaction) {
  if (!interaction.isButton()) return;

  if (interaction.customId === "tak") {
    await interaction.reply("❤️");
  } else if (interaction.customId === "nie") {
    await interaction.reply("😢");
  }
}