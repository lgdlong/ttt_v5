import { useEffect, useState, useRef } from "react"
import { Search, X } from "lucide-react"
import { VI } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
    <div className="relative flex items-center gap-2">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        placeholder={VI.searchPlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7"
          onClick={() => setValue("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}