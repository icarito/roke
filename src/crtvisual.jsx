import { useEffect, useRef, useState } from "preact/hooks";
import "winbox/dist/css/winbox.min.css";
import "winbox/dist/css/themes/modern.min.css"; // optional
import WinBox from "react-winbox";
import { ReactTerminal } from "react-terminal";

export function CrtVisual({ crtBox }) {
  const [osd, setOsd] = useState("");
  const termWin = useRef(null);
  window._termWin = termWin;
  const canvas = useRef(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(480);

  useEffect(() => {
    if (crtBox == null) return;
    const winPos = termWin.current.getPosition();
    const winSize = termWin.current.getSize();
    if (winPos.y < crtBox.top) {
      setY(crtBox.top);
    }
    if (winPos.y + winSize.height > crtBox.bottom) {
      setHeight(crtBox.bottom - winPos.y);
    } 
    
    if (winPos.x < crtBox.left) {
      setX(crtBox.left);
    } 
    if (winPos.x + winSize.width > crtBox.right) {
      setWidth(crtBox.right - winPos.x);  
    }

    if (termWin.current.isMax()) {
      termWin.current.restore();
    }
    if (x + width > crtBox.right) {
      setWidth(crtBox.right - x);
    }
    if (y + height > crtBox.bottom) {
      setHeight(crtBox.bottom - y);
    }
  }, [crtBox]);

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
          width={width}
          height={height}
          x={x}
          y={y}
          top={crtBox?.top || 0}
          left={crtBox?.left || 0}
          right={window.innerWidth - crtBox?.right || 0}
          bottom={window.innerHeight - crtBox?.bottom || 0}
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
        <canvas ref={canvas} tabIndex="1" id="game_canvas"></canvas>
      </div>
    </div>
  );
}
