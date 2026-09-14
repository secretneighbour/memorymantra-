import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected issue occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Smriti Care Error Boundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (window.location.hash) {
      window.location.hash = '#/';
    } else {
      window.location.pathname = '/';
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ner-offwhite flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-ner-border text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-ner-terracotta/10 text-ner-terracotta flex items-center justify-center mx-auto mb-6 border border-ner-terracotta/20">
              <AlertCircle className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
              [ Gentle Care Notice ]
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-ner-black mb-3">
              We encountered a small pause.
            </h1>

            <p className="text-base text-ner-black/75 leading-relaxed mb-8">
              Don't worry, your personal memories, reminders, and daily progress are completely safe. Let's get you right back to your comfortable care space.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-ner-black text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-ner-black/85 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Home className="w-4 h-4 text-ner-terracotta" />
                <span>Return to Home</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-ner-offwhite border border-ner-border text-ner-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-ner-black hover:text-white flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refresh App</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-ner-border/60">
              <span className="text-[11px] font-mono text-ner-black/40">
                Smriti Care Desktop • Offline Safe Care
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
