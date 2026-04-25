import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { VI } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface VideoSearchBarProps {
  onSearchChange: (term: string) => void
}

export function VideoSearchBar({ onSearchChange }: VideoSearchBarProps) {
  const [value, setValue] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value, onSearchChange])

  return (
    <div className="relative flex items-center gap-2">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={VI.searchPlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
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