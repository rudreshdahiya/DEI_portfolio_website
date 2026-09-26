import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backgroundColor: "#F6F4F7",
            color: "#1E1A24",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              backgroundColor: "#FFFFFF",
              padding: "2.5rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E4DEE6",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(184, 68, 114, 0.1)",
                color: "#5C2A57",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              !
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "#5C2A57",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#595260",
                lineHeight: "1.5",
                marginBottom: "1.5rem",
              }}
            >
              An unexpected error occurred while loading this page.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#5C2A57",
                color: "#FFFFFF",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: "600",
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
