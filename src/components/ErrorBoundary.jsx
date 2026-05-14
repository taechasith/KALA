import { Component } from "react"

export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="glass rounded-xl p-6 border border-red-500/30 max-w-lg">
            <p className="font-mono text-xs text-red-400 mb-2">⚠ RENDER ERROR</p>
            <p className="font-mono text-xs text-slate-400 whitespace-pre-wrap break-all">
              {this.state.error.message}
            </p>
            <button
              onClick={() => this.setState({ error: null })}
              className="mt-4 px-3 py-1 rounded font-mono text-xs border border-white/10 text-slate-400 hover:text-white"
            >
              RETRY
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
