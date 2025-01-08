import React, { useState, useRef, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { IconEraser, IconPencil, IconRestore } from "@tabler/icons-react";

const iconButton =
  "p-2 rounded-xl border cursor-pointer dark:border-accent-900 dark:text-accent-200";
const defaultIconButton =
  "bg-transparent text-accent-900 hover:bg-accent-100 dark:hover:bg-accent-800";

function Sketch({ socket, strocks , onStroked , meetingCode}) {
  const [eraser, setEraser] = useState(false);
  const [clientid, setClientId] = useState(null);

  const ref = useRef(null);

  const [strokeColor, setStrokeColor] = useState("#6497eb");
  useEffect(() => {
    console.log('component did mount....' , strocks)
    if ((strocks.paths.length ?? 0) > 0) {
      ref.current.loadPaths(strocks);
    }
  }, [strocks]);

  useEffect(() => {
    if (socket) {
      setClientId(socket.id);
      socket.on("connection", () => {
        console.log("connection ::", socket.id);
      });

      // socket.on("channel", (chan) => {
      //   console.log("channel strokes Sketch", chan);
      //   if (ref.current) {
      //     ref.current.loadPaths(chan.strokes);
      //   }
      // });

      socket.on("drawn", (stroks , _meetingCode) => {
        console.log(stroks);
        if (ref.current && meetingCode === _meetingCode) {
          ref.current.loadPaths(stroks);
        }
      });
    }
  }, [socket]);

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

  const pencilSelected = !eraser
    ? "bg-accent-600 text-accent-50 hover:bg-accent-600 hover:text-accent-50"
    : defaultIconButton;

  const eraserSelected = eraser
    ? "bg-accent-600 text-accent-50 hover:bg-accent-600 hover:text-accent-50"
    : defaultIconButton;

  const onColorChange = (event) => {
    setStrokeColor(event.target.value);
  };

  return (
    <div className="reset-wrapper flex gap-4">
      <h1>ClientID :: {clientid}</h1>
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
            onStroked(e)
          }
        }}
        // onChange={(e) => {
        //   console.log(e);
        //   if (socket && e != null && e.length > 0) {
        //     socket.emit("drawn", e);
        //   }
        // }}
      />
      <div className="flex flex-col w-10">
        <div className="w-auto h-9 rounded-full overflow-hidden">
          <input
            title="Color"
            className="bg-transparent border-none cursor-pointer appearance-none transform-cpu -translate-x-1/4 -translate-y-1/4"
            type="color"
            value={strokeColor}
            onChange={onColorChange}
          />
        </div>
        <hr />
        <button
          title="Pencil"
          className={`${iconButton} ${pencilSelected}`}
          type="button"
          aria-label="pencil"
          onClick={handlePencilClick}
        >
          <IconPencil />
        </button>
        <button
          title="Eraser"
          className={`${iconButton} ${eraserSelected}`}
          type="button"
          aria-label="eraser"
          onClick={handleEraserClick}
        >
          <IconEraser />
        </button>
        <hr />
        <button
          title="Reset"
          className={`${iconButton} ${defaultIconButton}`}
          type="button"
          aria-label="clear"
          onClick={handleResetClick}
        >
          <IconRestore />
        </button>
      </div>
    </div>
  );
}

export default Sketch;
