import levels from "./assets/backrooms/levels.json";
import { Groq } from "groq-sdk";

const model = "llama-3.3-70b-versatile";

let groq;
export function initGroq(apiKey) {
  groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
}
console.log(window.location.hash)
if (localStorage.getItem("groqApiKey")) {
  initGroq(localStorage.getItem("groqApiKey"));
} else if (
  window.location.hash.startsWith("#gsk_") &&
  window.location.hash.length == 57
) {
  initGroq(window.location.hash.slice(1));
  // window.location.hash = "";
}
const messages = [];

function groqBanner() {
  window.term.writeObject(
    {
      msg: `No es posible activar las funciones generativas.
Para jugar R.O.K.E. con todas sus características necesitas una API KEY.
Por favor, obtenga una API KEY.`,
      "dónde?":
        "Puedes pedirle una a Sebastian (autor de R.O.K.E.) o crear la tuya propia en Groq.com.",
      listo: "Bien, ahora escribe abajo la API KEY sin nada más.",
    },
    "msg"
  );
}

export async function converse(text, player) {
  if (!groq) {
    groqBanner();
    return;
  }
  window.term.loading(true);
  let roomChat;
  try {
    roomChat = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres el guionista y dramaturgo de un videojuego llamado R.O.K.E. - 
          que consiste en explorar un espacio infinito del lore del Internet 
          llamado "Backrooms". 
          
          Tu respuesta debe ser un objeto json que contenga al menos:
           "response", "advice" y "demotivationalQuote".

           El input del usuario vendrá en el campo "content" y el estatus del
           usuario en el campo "status" del objeto json que recibiriás.
          `,
        },
        ...messages,
        {
          role: "user",
          content: JSON.stringify({ content: text, status: player.status }),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: model,
      temperature: 1.4,
      max_tokens: 3000,
      top_p: 1,
      stream: false,
      stop: null,
    });
  } catch (error) {
    console.error(error);
  } finally {
    window.term.loading(false);
  }

  const response = JSON.parse(roomChat.choices[0].message.content);
  messages.push(roomChat.choices[0].message);
  // writeln(response.response + "\n");
  // console.log(response)
  return response;
}

export async function getRoomDescription(room, player) {
  if (!groq) {
    groqBanner();
    return;
  }
  window.term.loading(true);
  let roomChat;
  try {
    roomChat = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres el guionista y dramaturgo de un videojuego llamado R.O.K.E. - 
          que consiste en explorar un espacio infinito del lore del Internet 
          llamado "Backrooms". En cada cambio de pantalla el front-end del 
          juego te enviará un json describiendo el nivel y opcionalmente el 
          estatus del jugador. Tu tarea es retornar una prosa del nivel y/o 
          la situación, muy breve y levemente sarcástica. No alucines.
          
          Piensa bien tu respuesta, que sea narrativa y no mucho más.
          Usa oraciones completas y gramática correcta en todos los campos.
          
          El jugador acaba de entrar a: ${player.status.location.level} - ${player.status.location.room}.
          Haz una referencia a la habitación.

          Tu respuesta debe ser un objeto que contenga al menos:
           "shortDescription", "longDescription" y "easterEgg".
           
           Recuerda ser breve.
           `,
        },
        {
          role: "user",
          content: JSON.stringify({ room, player_status: player.status }),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: "llama-3.3-70b-versatile",
      temperature: 1.6,
      max_tokens: 3000,
      top_p: 1,
      stream: false,
      stop: null,
    });
  } catch (error) {
    console.error(error);
  } finally {
    window.term.loading(false);
  }
  const response = JSON.parse(roomChat.choices[0].message.content);
  messages.push(roomChat.choices[0].message);
  window.term.writeObject(response, "shortDescription");
  //writeln(response.shortDescription + "\n");
  //writeln(response.longDescription + "\n");
  return roomChat;
}

function simpleChecksum(data) {
  let checksum = 0;

  // Iterate through each character in the data
  for (let i = 0; i < data.length; i++) {
    // Add the ASCII value of
    //  the character to the checksum
    checksum += data.charCodeAt(i);
  }

  // Ensure the checksum is within
  //the range of 0-255 by using modulo
  return checksum % 256;
}

export function getRoom(player) {
  const level = levels.find(
    (level) => level.level == player.status.location.level
  );
  const room = player.status.location.room;
  getRoomDescription(level, player);
  window.visual.flash(
    <>
      <h2>&quot;{level.name}&quot;</h2>
      <h3>Sector {room}</h3>
    </>
  );
  return { ...level, checksum: simpleChecksum(level.level + "#" + room) };
}
