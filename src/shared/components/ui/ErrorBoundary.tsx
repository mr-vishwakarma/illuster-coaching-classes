import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.handleRetry} onGoHome={this.handleGoHome} />;
    }

    return this.props.children;
  }
}

// ─── Fallback UI ─────────────────────────────────────────────────────────────
interface ErrorFallbackProps {
  onRetry: () => void;
  onGoHome: () => void;
}

const ErrorFallback = ({ onRetry, onGoHome }: ErrorFallbackProps) => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
    {/* Ambient red glow */}
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="text-center relative z-10 max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <AlertTriangle size={36} className="text-red-400" />
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
          Something went wrong
        </h2>
        <p className="text-white/50 text-base mb-10 leading-relaxed">
          An unexpected error occurred. Don't worry — your data is safe.
          <br />
          Try refreshing or head back to the home page.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl w-full sm:w-auto justify-center cursor-pointer"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Home size={16} />
          Go Home
        </button>
      </motion.div>
    </div>
  </div>
);

export default ErrorBoundary;
