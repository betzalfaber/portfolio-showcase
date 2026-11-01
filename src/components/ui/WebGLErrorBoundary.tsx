import React, { Component, ErrorInfo, ReactNode } from 'react';
import { NexusFallback2D } from '../../scenes/NexusFallback2D';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[Nexus WebGL Protection] WebGL rendering error intercepted:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <NexusFallback2D />;
    }

    return this.props.children;
  }
}
