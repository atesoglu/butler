import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { 
  InlineNotification, 
  Button, 
  Tile, 
  Stack,
  SkeletonText,
  SkeletonPlaceholder
} from '@carbon/react';
import { Warning, ArrowRight, Home, Information } from '@carbon/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRecovering: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      isRecovering: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console and potentially to a logging service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // In a real app, you might want to send this to a logging service
    if (window.electronAPI) {
      window.electronAPI.invoke('log-message', `Error: ${error.message}\nStack: ${error.stack}`);
    }
  }

  handleRetry = () => {
    this.setState({ isRecovering: true });
    
    // Simulate recovery process
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRecovering: false
      });
    }, 1000);
  };

  handleGoHome = () => {
    window.location.hash = '/';
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: false
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.state.isRecovering) {
        return (
          <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
            <Tile>
              <Stack gap={6}>
                <SkeletonPlaceholder />
                <SkeletonText paragraph lineCount={4} />
                <div style={{ display: 'flex', gap: 16 }}>
                  <SkeletonPlaceholder />
                  <SkeletonPlaceholder />
                </div>
              </Stack>
            </Tile>
          </div>
        );
      }

      return (
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
          <InlineNotification
            kind="error"
            title="Something went wrong"
            subtitle="An unexpected error occurred. Please try again or contact support if the problem persists."
            lowContrast
            style={{ marginBottom: 24 }}
          />
          
          <Tile>
            <Stack gap={6}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Warning size={32} style={{ color: 'var(--cds-support-error)' }} />
                <h2>Application Error</h2>
              </div>
              
              <div>
                <h3>Error Details</h3>
                <p style={{ color: 'var(--cds-text-secondary)', marginBottom: 8 }}>
                  {this.state.error?.message || 'An unknown error occurred'}
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details style={{ marginTop: 16 }}>
                    <summary style={{ cursor: 'pointer', color: 'var(--cds-interactive-01)' }}>
                      Stack Trace (Development Only)
                    </summary>
                    <pre style={{ 
                      background: 'var(--cds-ui-01)', 
                      padding: 16, 
                      borderRadius: 4, 
                      overflow: 'auto',
                      fontSize: 12,
                      marginTop: 8
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button 
                  kind="primary" 
                  renderIcon={ArrowRight} 
                  onClick={this.handleRetry}
                >
                  Try Again
                </Button>
                <Button 
                  kind="secondary" 
                  renderIcon={Home} 
                  onClick={this.handleGoHome}
                >
                  Go Home
                </Button>
                <Button 
                  kind="tertiary" 
                  renderIcon={Information} 
                  onClick={this.handleReload}
                >
                  Reload App
                </Button>
              </div>
              
              <div style={{ 
                background: 'var(--cds-ui-01)', 
                padding: 16, 
                borderRadius: 4,
                border: '1px solid var(--cds-ui-03)'
              }}>
                <h4 style={{ marginTop: 0, marginBottom: 8 }}>What you can do:</h4>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Try the action again</li>
                  <li>Navigate to a different page</li>
                  <li>Check your internet connection</li>
                  <li>Clear your browser cache</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              </div>
            </Stack>
          </Tile>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 