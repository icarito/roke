/* eslint-disable react/react-in-jsx-scope */
import {
  Terminal,
  useEventQueue,
  textLine,
  textWord,
  buttonWord,
} from "crt-terminal";
import { initGroq, converse } from "./backrooms";

const bannerText = `\nIniciando sistema...\n\n`;

export function CrtTerminal() {
  const eventQueue = useEventQueue();
  const { print } = eventQueue.handlers;

  function onButton(result, button) {
    window.term.write(result + "\n\n");
    button.remove();
  }

  function printObject(obj, first = null) {
    const keys = Object.keys(obj).filter((key) => key != first);
    print([
      textLine({
        words: [textWord({ characters: obj[first] || "<=" })],
      }),
      textLine({
        words: keys.map((key) =>
          buttonWord({
            characters: key,
            onClick: (ev) => onButton(obj[key].toString(), ev.target),
          })
        ),
      }),
    ]);
  }

  // BAD BAD DO NOT DO FIXME
  window.term = {
    write: (text) =>
      print([textLine({ words: [textWord({ characters: text })] })]),
    writeObject: printObject,
    ...eventQueue.handlers,
  };

  async function onCommand(command) {
    if (command.startsWith("gsk_") && command.length == 56) {
      localStorage.setItem("groqApiKey", command)
      initGroq(command)
      window.term.write("API KEY guardada.")
      return;
    }
    let result;
    try {
      const res = eval(command);
      console.log(res);
      if (res) {
        result = { response: res.toString ? res.toString() : res };
      }
    } catch (e) {
      console.error(e);

      try {
        result = await converse(command, window.player);
      } catch (e) {
        console.error(e);
      }
    }
    if (result) {
      printObject(result, "response");
    }
  }

  return (
    <div id="terminal"
    style={{ width: "1000px", height: "550px" }}>
      <Terminal
        queue={eventQueue}
        banner={[textLine({ words: [textWord({ characters: bannerText })] })]}
        onCommand={onCommand}
      />
    </div>
  );
}
