import React from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check, Terminal } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // Ignore storage clear failure
    }
    window.location.href = '/overview';
  };

  handleCopyDiagnostics = () => {
    const diagnosticReport = [
      `AUTORAIL TELEMETRY CRASH REPORT`,
      `Timestamp: ${new Date().toISOString()}`,
      `URL: ${window.location.href}`,
      `Error: ${this.state.error?.toString() || 'Unknown error'}`,
      `Stack: ${this.state.error?.stack || 'No stack trace'}`,
      `Component Stack: ${this.state.errorInfo?.componentStack || 'No component stack'}`
    ].join('\n\n');

    navigator.clipboard.writeText(diagnosticReport).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-2xl w-full bg-bg-surface border border-status-danger/40 rounded-2xl p-8 shadow-2xl shadow-status-danger/10 backdrop-blur-md">
            {/* Header Badge */}
            <div className="flex items-center space-x-3 pb-6 border-b border-border-default/60">
              <div className="w-12 h-12 rounded-xl bg-status-danger/10 border border-status-danger/30 flex items-center justify-center text-status-danger">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-status-danger/20 text-status-danger border border-status-danger/40">
                    Telemetry Fault Code 500
                  </span>
                  <span className="text-text-muted text-xs font-mono">AUTORAIL FAILSAFE</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-text-primary mt-1">
                  Subsystem Rendering Interrupted
                </h1>
              </div>
            </div>

            {/* Description */}
            <div className="py-6 space-y-4">
              <p className="text-sm text-text-secondary leading-relaxed">
                An unhandled rendering fault occurred within this cockpit viewport. The failsafe system has isolated the component to prevent data corruption.
              </p>

              {/* Technical Drawer */}
              <div className="bg-bg-primary/80 border border-border-default rounded-xl p-4 font-mono text-xs overflow-hidden">
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-text-muted" />
                    <span className="uppercase tracking-wider text-[10px]">Diagnostics Output</span>
                  </span>
                  <button
                    onClick={this.handleCopyDiagnostics}
                    className="flex items-center space-x-1 text-primary hover:text-primary-hover text-[11px] transition-colors"
                  >
                    {this.state.copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{this.state.copied ? 'Copied' : 'Copy Report'}</span>
                  </button>
                </div>
                <div className="text-status-danger font-semibold break-all">
                  {this.state.error?.toString()}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-[11px] text-text-muted max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </div>

            {/* Recovery Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border-default/60">
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-primary-content hover:bg-primary-hover font-medium text-xs transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reinitialize Subsystem</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={this.handleHardReset}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-hover text-text-secondary hover:text-text-primary border border-border-default text-xs transition-colors"
                >
                  <span>Reset Cache & Storage</span>
                </button>
                <a
                  href="/overview"
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-hover text-text-secondary hover:text-text-primary border border-border-default text-xs transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Fleet Overview</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
