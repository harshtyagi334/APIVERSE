import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-12 bg-destructive/5 rounded-[2rem] border border-destructive/20 text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Component Initialization Failed</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            The technical module encountered a fatal exception during rendering.
          </p>
          <Button 
            variant="outline" 
            className="rounded-full uppercase text-[10px] font-black tracking-widest border-destructive/20 text-destructive hover:bg-destructive/10"
            onClick={() => this.setState({ hasError: false })}
          >
            Clear Stack & Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
