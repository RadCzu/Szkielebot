import { Client, TextChannel } from "discord.js";

export async function sendTestMessage(client: Client): Promise<void> {
  try {
    // Replace with your target channel ID
    const channelId = "1415633788268052482";

    // Fetch the channel
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      throw new Error("Channel not found or is not text-based.");
    }

    const url = "https://szkielaton.pl/media/audio.mp3";

    const skeletonArt = `
          .            )        )
                  (  (|              .
              )   )\\/ ( ( (
      *  (   ((  /     ))\\))  (  )    )
    (     \\   )\\(          |  ))( )  (|
    >)     ))/   |          )/  \\((  ) \\
    (     (      .        -.     V )/   )(    (
     \\   /     .   \\            .       \\))   ))
       )(      (  | |   )            .    (  /
      )(    ,'))     \\ /          \\( '.    )
      (\\>  ,'/__      ))            __'.  /
     ( \\   | /  ___   ( \\/     ___   \\ | ( (
      \\.)  |/  /   \\__      __/   \\   \\|  ))
     .  \\. |>  \\      | __ |      /   <|  /
          )/    \\____/ :..: \\____/     \\ <
   )   \\ (|__  .      / ;: \\          __| )  (
  ((    )\\)  ~--_     --  --      _--~    /  ))
   \\    (    |  ||               ||  |   (  /
         \\.  |  ||_             _||  |  /
           > :  |  ~V+-I_I_I-+V~  |  : (.
          (  \\:  T\\   _     _   /T  : ./ 
           \\  :    T^T T-+-T T^T    ;< 
            \\..'_       -+-       _'  )
  )            . '--=.._____..=--'. ./         (
 ((     ) (          )             (     ) (   )> 
  > \\/^/) )) (   ( /(.      ))     ))._/(__))./ (_.
 (  _../ ( \\))    )   \\ (  / \\.  ./ ||  ..__:|  _. \\
 |  \\__.  ) |   (/  /: :)) |   \\/   |(  <.._  )|  ) )
))  _./   |  )  ))  __  <  | :(     :))   .//( :  : |
(: <     ):  --:   ^  \\  )(   )\\/:   /   /_/ ) :._) :
 \\..)   (_..  ..  :    :  : .(   \\..:..    ./__.  ./
            ^    ^      \\^ ^           ^\\/^     ^
`;

    // Option 1: Send as a link
  await (channel as TextChannel).send("```\n" + skeletonArt + "\n```");
  await channel.send({ files: [url] });

    // Option 2: Send as an uploaded file
    // await (channel as TextChannel).send({ files: [url] });

    console.log(`✅ Sent test message to #${(channel as TextChannel).name}`);
  } catch (error) {
    console.error("❌ Failed to send message:", error);
  }
}
