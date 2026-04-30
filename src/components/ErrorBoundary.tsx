import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-6 max-w-md">
            Our automated QA bots caught an unhandled exception. This has been
            logged.
          </p>
          <div className="p-4 bg-slate-100 rounded text-left w-full max-w-2xl overflow-auto text-xs text-slate-800 mb-6">
            <pre>{this.state.error?.message}</pre>
          </div>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
