import { useState } from "preact/hooks";

export function CrtVisual() {
  const [osd, setOsd] = useState("");

  function flash(output) {
    setOsd(output);
  }
  window.visual = {
    flash: flash,
  };

  return (
    <div id="game">
      <div id="game_overlay">{osd}</div>
      <div id="game_margin">
        <canvas tabIndex="1" id="game_canvas"></canvas>
      </div>
    </div>
  );
}
