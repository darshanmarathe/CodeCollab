import React from "react";

export default function ConnectionStatus({ status }) {
  const config = {
    connected: { color: "#34d399", label: "Connected", icon: "bi-wifi" },
    connecting: { color: "#fbbf24", label: "Connecting...", icon: "bi-wifi" },
    disconnected: { color: "#ef4444", label: "Disconnected", icon: "bi-wifi-off" },
  };

  const { color, label, icon } = config[status] || config.disconnected;

  return (
    <div className="connection-status" title={label}>
      <span className="connection-dot" style={{ backgroundColor: color }}></span>
      <span className="connection-label">{label}</span>
    </div>
  );
}
