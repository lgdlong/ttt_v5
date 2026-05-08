import { useEffect, useState, useRef } from "react"
import { IconSearch, IconX } from "@tabler/icons-react"
import { VI } from "@/lib/constants"
import { TextInput, ActionIcon } from "@mantine/core"

interface VideoSearchBarProps {
  onSearchChange: (term: string) => void
}

export function VideoSearchBar({ onSearchChange }: VideoSearchBarProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value, onSearchChange])

  // Close keyboard on Enter (mobile UX)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      inputRef.current?.blur()
    }
  }

  // Close keyboard when touching outside (mobile UX)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        inputRef.current.blur()
      }
    }
    document.addEventListener("touchstart", handleTouchStart)
    return () => document.removeEventListener("touchstart", handleTouchStart)
  }, [])

  return (
    <TextInput
      ref={inputRef}
      type="search"
      placeholder={VI.searchPlaceholder}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
      leftSection={<IconSearch size={16} className="text-muted-foreground" />}
      rightSection={
        value ? (
          <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setValue("")}>
            <IconX size={16} />
          </ActionIcon>
        ) : null
      }
      w="100%"
    />
  )
}