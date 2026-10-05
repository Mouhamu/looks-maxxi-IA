import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LooksMaxxi BP Runtime Diagnostic caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    try {
      sessionStorage.clear();
    } catch (e) {
      // Ignore
    }
    window.location.reload();
  };

  private handleClearAllAndReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // Ignore
    }
    window.location.reload();
  };

  private categorizeError(msg: string): { type: string; title: string; hint: string } {
    const lower = msg.toLowerCase();
    if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('load')) {
      return {
        type: 'Network Error',
        title: 'Connection Interrupted',
        hint: 'Please check your internet connection or dev server and retry.',
      };
    }
    if (lower.includes('quota') || lower.includes('localstorage') || lower.includes('storage')) {
      return {
        type: 'Storage Error',
        title: 'Device Memory Limit',
        hint: 'Local storage quota reached. Clearing older scan previews will resolve this.',
      };
    }
    if (lower.includes('ai') || lower.includes('gemini') || lower.includes('model') || lower.includes('vision')) {
      return {
        type: 'AI Vision Error',
        title: 'Biometric Engine Interrupted',
        hint: 'The AI vision pipeline experienced a processing delay. Heuristic engine is ready.',
      };
    }
    if (lower.includes('camera') || lower.includes('upload') || lower.includes('image') || lower.includes('canvas')) {
      return {
        type: 'Media / Upload Error',
        title: 'Photo Acquisition Issue',
        hint: 'Unable to process camera feed or file format. Ensure photo is in JPEG or PNG format.',
      };
    }
    if (lower.includes('auth') || lower.includes('token') || lower.includes('unauthorized')) {
      return {
        type: 'Authentication Error',
        title: 'Session Verification Expired',
        hint: 'Please continue as Guest or re-authenticate your profile.',
      };
    }
    return {
      type: 'Runtime Error',
      title: 'Unexpected Component Failure',
      hint: 'A rendering exception was safely caught. The application can recover automatically.',
    };
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMsg = this.state.error?.message || 'Unknown runtime exception';
      const diag = this.categorizeError(errorMsg);

      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
            {/* Diagnostic Icon */}
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400 text-2xl">
              🛡️
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20 inline-block mb-2">
              {diag.type}
            </span>

            <h3 className="text-lg font-black text-white mb-2">{diag.title}</h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {diag.hint}
            </p>

            {/* Error Message Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 text-left mb-6 break-words max-h-28 overflow-y-auto">
              {errorMsg}
            </div>

            {/* Recovery Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all touch-press"
              >
                Reload Application
              </button>

              <button
                onClick={this.handleClearAllAndReset}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors touch-press"
              >
                Reset Storage & Start Fresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
