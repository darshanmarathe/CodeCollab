import React, { useState, useRef, useCallback, useEffect } from "react";

let peer = null;

export default function ScreenShare({ meetingCode, loggedinUsers, currentUser }) {
  const [status, setStatus] = useState("idle"); // idle | connecting | sharing | watching | error
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);

  const stopSharing = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (peer) {
      peer.destroy();
      peer = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (peer) {
        peer.destroy();
        peer = null;
      }
    };
  }, []);

  const handleShare = async () => {
    setError(null);
    setStatus("connecting");

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });

      localStreamRef.current = stream;

      // Show local preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }

      // Handle user stopping via browser "Stop sharing" button
      stream.getVideoTracks()[0].onended = () => {
        stopSharing();
      };

      // Setup peer
      peer = new window.Peer(meetingCode + "-screen");

      peer.on("open", () => {
        setStatus("sharing");
        // Call all other users
        loggedinUsers.forEach((u) => {
          if (u.name !== currentUser) {
            try {
              peer.call(u.name + "-screen", stream);
            } catch (e) {
              console.warn("Could not call", u.name, e);
            }
          }
        });
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
        setError("Connection error. Please try again.");
        stopSharing();
      });
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Screen share cancelled.");
      } else {
        setError("Could not start screen share: " + err.message);
      }
      setStatus("idle");
    }
  };

  const handleWatch = () => {
    setError(null);
    setStatus("connecting");

    peer = new window.Peer(currentUser + "-screen");

    peer.on("open", () => {
      setStatus("watching");
    });

    peer.on("call", (call) => {
      call.answer();

      call.on("stream", (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
          videoRef.current.muted = false;
          videoRef.current.play().catch(() => {});
        }
      });

      call.on("close", () => {
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      });
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
      if (err.type === "peer-unavailable") {
        setError("No one is sharing their screen yet.");
      } else {
        setError("Connection error. Please try again.");
      }
      stopSharing();
    });
  };

  return (
    <div className="screen-section">
      <div className="screen-hero">
        <div className={"screen-hero-icon" + (status === "sharing" ? " sharing" : "")}>
          <i className={status === "sharing" ? "bi bi-camera-video-fill" : "bi bi-display"}></i>
        </div>

        {status === "idle" && (
          <>
            <h2 className="screen-hero-title">Screen Sharing</h2>
            <p className="screen-hero-desc">
              Share your screen with collaborators or watch theirs in real time.
            </p>
            <div className="screen-controls">
              <button className="btn-share success" onClick={handleShare}>
                <i className="bi bi-camera-video-fill"></i>
                Share My Screen
              </button>
              <button className="btn-share primary" onClick={handleWatch}>
                <i className="bi bi-eye-fill"></i>
                Watch
              </button>
            </div>
          </>
        )}

        {status === "connecting" && (
          <>
            <h2 className="screen-hero-title">Connecting...</h2>
            <p className="screen-hero-desc">Setting up peer connection.</p>
            <div className="screen-spinner"></div>
          </>
        )}

        {status === "sharing" && (
          <>
            <h2 className="screen-hero-title">Sharing Screen</h2>
            <p className="screen-hero-desc">
              Your screen is visible to all collaborators. Click "Stop" or use your browser's stop-sharing bar to end.
            </p>
            <div className="screen-controls">
              <button className="btn-share danger" onClick={stopSharing}>
                <i className="bi bi-stop-fill"></i>
                Stop Sharing
              </button>
            </div>
          </>
        )}

        {status === "watching" && (
          <>
            <h2 className="screen-hero-title">Watching</h2>
            <p className="screen-hero-desc">
              Receiving screen share. Click "Stop" to disconnect.
            </p>
            <div className="screen-controls">
              <button className="btn-share danger" onClick={stopSharing}>
                <i className="bi bi-stop-fill"></i>
                Stop Watching
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="screen-error">
            <i className="bi bi-exclamation-triangle"></i>
            {error}
          </div>
        )}
      </div>

      <div className="screen-video-card">
        <video
          ref={videoRef}
          style={{ objectFit: "cover" }}
          controls
          playsInline
        ></video>
        {status === "idle" && (
          <div className="screen-video-placeholder">
            <i className="bi bi-camera-video"></i>
            <p>Screen preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
