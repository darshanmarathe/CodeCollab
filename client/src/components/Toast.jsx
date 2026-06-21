import React, { useEffect, useState } from "react";

export default function Toast({ message, type = "success", duration = 2000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    info: "bi-info-circle-fill",
    warning: "bi-exclamation-triangle-fill",
  };

  return (
    <div className={"toast-notification " + type + (visible ? " show" : " hide")}>
      <i className={"bi " + icons[type]}></i>
      <span>{message}</span>
    </div>
  );
}
