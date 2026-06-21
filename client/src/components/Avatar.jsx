import React from "react";

function getInitials(name) {
  if (!name || name === "NA") return "?";
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function hashColor(name) {
  if (!name) return "#6366f1";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

export default function Avatar({ name, color, size = 32 }) {
  const initials = getInitials(name);
  const bgColor = color || hashColor(name);

  return (
    <div
      className="user-avatar"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size * 0.38,
      }}
      title={name}
    >
      {initials}
    </div>
  );
}
