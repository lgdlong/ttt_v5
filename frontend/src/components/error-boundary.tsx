import { Component, type ReactNode } from "react"
import { Button, Flex, Text, Title } from "@mantine/core"
import { VI } from "@/lib/constants"
import { IconAlertCircle } from "@tabler/icons-react"

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

  componentDidCatch(error: Error) {
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
        <Flex direction="column" align="center" justify="center" h="100%" mih={200} gap="md" p="xl">
          <IconAlertCircle size={48} className="text-red-500" />
          <div className="text-center space-y-2">
            <Title order={3}>{VI.error}</Title>
            <Text size="sm" c="dimmed">
              {this.state.error?.message || "Đã xảy ra lỗi không xác định"}
            </Text>
          </div>
          <Button onClick={this.handleRetry} variant="outline">
            Thử lại
          </Button>
        </Flex>
      )
    }

    return this.props.children
  }
}
