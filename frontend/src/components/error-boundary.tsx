import { Component, type ReactNode, type ErrorInfo } from "react"
import { Button } from "@/components/ui/button"
import { VI } from "@/lib/constants"
import { AlertCircle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4 p-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{VI.error}</h3>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || "Đã xảy ra lỗi không xác định"}
            </p>
          </div>
          <Button onClick={this.handleRetry} variant="outline">
            Thử lại
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
