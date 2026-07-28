import { Component, ErrorInfo, ReactNode } from 'react'
import { ContentError } from '~components/Layout/ContentError'

type ErrorBoundaryProps = {
  children: ReactNode
  /**
   * Rendered instead of the children when they throw. Defaults to <ContentError />.
   * Pass `null` to render nothing at all (useful for decorative regions).
   */
  fallback?: ReactNode | ((error: Error) => ReactNode)
  /**
   * Values that, when any of them changes, clear the caught error and retry the children.
   * Needed for boundaries that outlive what they're rendering (i.e. those living outside
   * the tab panels, which react-router doesn't remount when only the tab param changes).
   */
  resetKeys?: unknown[]
}

type ErrorBoundaryState = {
  error: Error | null
}

/**
 * Catches render errors so a single misbehaving component can't take the whole page down.
 *
 * Mostly needed because processes may carry metadata in shapes we don't expect (i.e. those
 * created from the SaaS, whose metadata is not inlined by the node), which makes some
 * components dereference fields that aren't there.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error during render', error, info.componentStack)
  }

  componentDidUpdate(prev: ErrorBoundaryProps) {
    const { resetKeys } = this.props
    if (!this.state.error || !resetKeys) return

    const changed =
      resetKeys.length !== prev.resetKeys?.length || resetKeys.some((key, i) => !Object.is(key, prev.resetKeys?.[i]))
    if (changed) {
      this.setState({ error: null })
    }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const { fallback } = this.props
    if (typeof fallback === 'function') return fallback(error)
    if (fallback !== undefined) return fallback

    return <ContentError error={error} />
  }
}

export default ErrorBoundary
