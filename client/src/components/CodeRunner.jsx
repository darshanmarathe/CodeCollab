import React, { useState, useRef, useCallback } from "react";

export default function CodeRunner({ code, language }) {
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef(null);

  const runCode = useCallback(() => {
    if (language !== "javascript") {
      setOutput([{ type: "error", text: `Code execution only supports JavaScript. Current: ${language}` }]);
      setIsOpen(true);
      return;
    }

    setIsRunning(true);
    setOutput([]);
    setIsOpen(true);

    const logs = [];
    const sandbox = document.createElement("iframe");
    sandbox.style.display = "none";
    document.body.appendChild(sandbox);

    const timeout = setTimeout(() => {
      logs.push({ type: "error", text: "Execution timed out (5s limit)" });
      setOutput([...logs]);
      setIsRunning(false);
      document.body.removeChild(sandbox);
    }, 5000);

    sandbox.contentWindow.console.log = (...args) => {
      logs.push({ type: "log", text: args.map(a => {
        try { return typeof a === "object" ? JSON.stringify(a, null, 2) : String(a); }
        catch { return String(a); }
      }).join(" ") });
      setOutput([...logs]);
    };

    sandbox.contentWindow.console.error = (...args) => {
      logs.push({ type: "error", text: args.join(" ") });
      setOutput([...logs]);
    };

    sandbox.contentWindow.console.warn = (...args) => {
      logs.push({ type: "warn", text: args.join(" ") });
      setOutput([...logs]);
    };

    sandbox.contentWindow.console.info = sandbox.contentWindow.console.log;

    try {
      const result = sandbox.contentWindow.eval(code);
      if (result !== undefined) {
        logs.push({ type: "result", text: "=> " + (typeof result === "object" ? JSON.stringify(result, null, 2) : String(result)) });
        setOutput([...logs]);
      }
    } catch (err) {
      logs.push({ type: "error", text: err.toString() });
      setOutput([...logs]);
    }

    clearTimeout(timeout);
    setIsRunning(false);
    setTimeout(() => document.body.removeChild(sandbox), 100);
  }, [code, language]);

  return (
    <div className="code-runner">
      <button
        className="btn-share success"
        onClick={runCode}
        disabled={isRunning}
        title="Run code (JavaScript only)"
      >
        <i className={"bi " + (isRunning ? "bi-hourglass-split" : "bi-play-fill")}></i>
        {isRunning ? "Running..." : "Run"}
      </button>

      {isOpen && (
        <div className="runner-output">
          <div className="runner-header">
            <span className="runner-title">
              <i className="bi bi-terminal"></i>
              Output
            </span>
            <button className="runner-close" onClick={() => setIsOpen(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="runner-body">
            {output.length === 0 && !isRunning && (
              <span className="runner-empty">No output</span>
            )}
            {output.map((line, i) => (
              <div key={i} className={"runner-line " + line.type}>
                <pre>{line.text}</pre>
              </div>
            ))}
            {isRunning && <div className="runner-line log">Executing...</div>}
          </div>
        </div>
      )}
    </div>
  );
}
