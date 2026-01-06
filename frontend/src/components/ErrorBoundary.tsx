import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    // Reload the page to reset the app state
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#E8EDE7] to-[#F5F1E8] flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                We're sorry for the inconvenience. An unexpected error occurred.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <h2 className="text-lg font-bold text-red-900 mb-2">Error Details:</h2>
                <p className="text-sm text-red-800 font-mono mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-sm font-semibold text-red-900 cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-red-800 overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-8 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg"
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-all"
              >
                Reload Page
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
