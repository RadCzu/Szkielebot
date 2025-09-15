import { PermissionFlagsBits } from "discord.js";
import { CommandTemplate } from "../../models/Command";
import CiekawostkaModel from "../../models/Ciekawostka";

const addText: CommandTemplate = {
  name: "dodajtekstbozy",
  description: "Dodaj nową tekst boży do bazy danych",
  options: [
    {
      name: "tekst",
      description: "Treść tekstu",
      type: 3, // STRING
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guildId) {
      return interaction.editReply("❌ Ta komenda działa tylko na serwerze.");
    }

    try {
      const text = interaction.options.get("tekst")?.value as string;

      const ciekawostka = new CiekawostkaModel({
        guildId: interaction.guildId,
        text,
      });

      await ciekawostka.save();

      await interaction.editReply(`✅ Dodano ciekawostkę:\n> ${text}`);
      console.log(`Ciekawostka dodana: "${text}" dla guild ${interaction.guildId}`);
    } catch (error) {
      console.error("Błąd przy dodawaniu ciekawostki:", error);
      await interaction.editReply("❌ Wystąpił błąd podczas dodawania ciekawostki.");
    }
  },
  permissionsRequired: [PermissionFlagsBits.SendMessages], // minimal permission
  botPermissions: [PermissionFlagsBits.SendMessages],
};

export default addText;