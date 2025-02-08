import { useEffect, useRef, useState } from "preact/hooks";
import "winbox/dist/css/winbox.min.css";
import "winbox/dist/css/themes/modern.min.css"; // optional
import WinBox from "react-winbox";
import { ReactTerminal } from "react-terminal"

export function CrtVisual({ crtBox }) {
  const [osd, setOsd] = useState("")
  const termWin = useRef(null)

  useEffect(()=>{
    termWin.current.minimize()
  }, [])

  function flash(output) {
    setOsd(output);
  }
  window.visual = {
    flash: flash,
  };

  return (
    <div id="game">
      <div id="game_overlay">
        {osd}

        <WinBox
          title="Roke Console"
          className="modern"
          background="#f005"
          ref={termWin}
          hide={crtBox == null}
          /*width={crtBox?.right - crtBox?.left}
          height={crtBox?.bottom - crtBox?.top}
          x={crtBox?.left || "center"}
          y={crtBox?.top || "center"}*/
          top={crtBox?.top || 0}
          left={crtBox?.left || 0}
          right={window.innerWidth - crtBox?.right || 0}
          bottom={window.innerHeight - crtBox?.bottom || 0}
          onClose={()=>{
            termWin.current.minimize()
            return true
          }}
          noMax
          noMin
          noFull
        >
          <ReactTerminal
            showControlBar={false}
            theme="dark"
            width="100%"
          ></ReactTerminal>
        </WinBox>
      </div>
      <div id="game_margin">
        <canvas tabIndex="1" id="game_canvas"></canvas>
      </div>
    </div>
  );
}
