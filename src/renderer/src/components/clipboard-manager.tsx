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


  const deleteItem = async (id: number) => {
    try {
      window.api.deleteClipboardItem(id)
      toast("Item deleted.")
    } catch (error) {
      console.error("Failed to delete item:", error)
      toast("Failed to delete item.")
    }
  }

  return (
    <div className="h-screen bg-background" style={{"-webkit-app-region": "drag"}}>

        <Card className="synthwave-card h-full px-0 py-2 gap-0 ">
          <div className="pb-0 px-0 space-y-2 flex flex-col h-full">

            <div className="relative px-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent" />
              <Input
                placeholder="SEARCH CLIPBOARD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-mono bg-input border-glow text-foreground placeholder:text-muted-foreground tracking-wide"
                style={{"-webkit-app-region": "no-drag"}}
                autoFocus
              />
            </div>
            <ScrollArea className="flex-1 overflow-auto px-2">
            <div className="w-full">
              <div className="space-y-2" >
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground font-mono text-sm tracking-wide">◢ NO DATA FOUND ◣</div>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      style={{"-webkit-app-region": "no-drag"}}
                      className="group bg-secondary/80 border border-accent/30 rounded px-2 py-1 hover:border-accent hover:glow-cyan transition-all duration-300"
                    >
                      <div className="flex justify-between  gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-mono text-foreground break-all leading-relaxed" onClick={() => copyToClipboard(item.text)}

                            >
                            {item.text.length > 100 ? `${item.text.substring(0, 100)}...` : item.text}
                          </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity py-2">

                          <div
                            onClick={() => deleteItem(item?.id || 0)}
                            className="text-primary border-primary hover:text-background hover:glow-magenta font-mono"
                          >
                            <Trash2 className="w-4 h-4" />
                          </div>
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
