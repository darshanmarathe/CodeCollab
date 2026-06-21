import React, { useState, useRef, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

function Sketch({ socket, strocks, onStroked, meetingCode }) {
  const [eraser, setEraser] = useState(false);

  const ref = useRef(null);

  const [strokeColor, setStrokeColor] = useState("#6497eb");
  useEffect(() => {
    if (strocks && (strocks.paths?.length ?? 0) > 0) {
      ref.current.loadPaths(strocks);
    }
  }, [strocks]);

  useEffect(() => {
    if (socket) {
      socket.on("connection", () => {
        console.log("connection ::", socket.id);
      });

      socket.on("drawn", (stroks, _meetingCode) => {
        console.log(stroks);
        if (ref.current && meetingCode === _meetingCode) {
          ref.current.loadPaths(stroks);
        }
      });
    }
  }, [socket, meetingCode]);

  const handleEraserClick = () => {
    setEraser(true);
    if (ref.current) {
      ref.current.eraseMode(true);
    }
  };

  const handlePencilClick = () => {
    setEraser(false);
    if (ref.current) {
      ref.current.eraseMode(false);
    }
  };

  const handleResetClick = () => {
    if (ref.current) {
      ref.current.resetCanvas();
    }
  };

  const onColorChange = (event) => {
    setStrokeColor(event.target.value);
  };

  return (
    <>
      <div className="sketch-toolbar">
        <input
          title="Color"
          className="sketch-color-picker"
          type="color"
          value={strokeColor}
          onChange={onColorChange}
        />
        <div className="sketch-divider"></div>
        <button
          title="Pencil"
          className={"sketch-tool-btn" + (!eraser ? " active" : "")}
          type="button"
          aria-label="pencil"
          onClick={handlePencilClick}
        >
          <i className="bi bi-pencil"></i>
        </button>
        <button
          title="Eraser"
          className={"sketch-tool-btn" + (eraser ? " active" : "")}
          type="button"
          aria-label="eraser"
          onClick={handleEraserClick}
        >
          <i className="bi bi-eraser"></i>
        </button>
        <div className="sketch-divider"></div>
        <button
          title="Reset"
          className="sketch-tool-btn"
          type="button"
          aria-label="clear"
          onClick={handleResetClick}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
      <div className="sketch-canvas-card">
        <ReactSketchCanvas
          ref={ref}
          canvasColor="transparent"
          height="400px"
          width="1000px"
          strokeWidth={4}
          strokeColor={strokeColor}
          onStroke={(e) => {
            console.log(e);
            if (socket && e != null) {
              socket.emit("drawn", e, meetingCode);
              onStroked(e);
            }
          }}
        />
      </div>
    </>
  );
}

export default Sketch;
