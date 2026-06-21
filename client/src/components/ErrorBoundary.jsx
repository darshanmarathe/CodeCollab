import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h2>Something went wrong</h2>
            <p className="error-boundary-message">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <div className="error-boundary-actions">
              <button className="btn-share primary" onClick={this.handleRetry}>
                <i className="bi bi-arrow-counterclockwise"></i>
                Try Again
              </button>
              <button className="btn-share" onClick={this.handleReload} style={{ background: "var(--surface-hover)", color: "var(--text-primary)" }}>
                <i className="bi bi-arrow-repeat"></i>
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
