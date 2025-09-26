import { useEffect, useState } from "react"

import { Copy, Trash2, Search } from "lucide-react"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import type { ClipboardItem } from "@renderer/env"
import { toast } from "sonner"

export function ClipboardManager() {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([])

  useEffect(() => {
    // Try to initialize with API
    const initializeWithApi = async () => {
        try {
          const history = await window.api.getClipboardHistory()
          setClipboardItems(history)

          // Subscribe to clipboard updates
          window.api.onClipboardUpdated((items) => {
            setClipboardItems(items)
          })
        } catch (error) {
          console.error('Failed to initialize clipboard history:', error)
        }
    }

    initializeWithApi()

    // Cleanup subscription on unmount
    return () => {
      if (window.api) {
        window.api.removeClipboardListener()
      }
    }
  }, [])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = clipboardItems.filter((item) => item.text.toLowerCase().includes(searchQuery.toLowerCase()))

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)

      toast("Item copied to clipboard.")
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const deleteItem = (id: number) => {
    setClipboardItems((items) => items.filter((item) => item.id !== id))
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) {
      return `${minutes}m ago`
    } else {
      return `${hours}h ago`
    }
  }

  return (
    <div className="h-screen bg-background" style={{"-webkit-app-region": "drag"}}>
        <Card className="synthwave-card h-full py-4 pb-0 gap-0 ">
          <div className="py-4 pb-0 px-2 space-y-4 flex flex-col h-full">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent" />
              <Input
                placeholder="SEARCH CLIPBOARD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-mono bg-input border-glow text-foreground placeholder:text-muted-foreground tracking-wide"
                style={{"-webkit-app-region": "no-drag"}}
              />
            </div>
            <ScrollArea className="flex-1 overflow-auto">
            <div className="w-full">
              <div className="space-y-3" style={{"-webkit-app-region": "no-drag"}}>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground font-mono text-sm tracking-wide">◢ NO DATA FOUND ◣</div>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-secondary/80 border border-accent/30 rounded px-4 py-2 hover:border-accent hover:glow-cyan transition-all duration-300"

                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-accent font-mono mb-2 tracking-wider">
                            ◢ {formatTimestamp(new Date(item.timestamp)).toUpperCase()} ◣
                          </div>
                          <div className="text-sm font-mono text-foreground break-all leading-relaxed" onClick={() => copyToClipboard(item.text)}>
                            {item.text.length > 100 ? `${item.text.substring(0, 100)}...` : item.text}
                          </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteItem(item?.id || 0)}
                            className="text-primary border-primary hover:bg-primary hover:text-background hover:glow-magenta font-mono"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
  )
}
