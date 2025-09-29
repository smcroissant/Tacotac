/// <reference types="vite/client" />

export interface ClipboardItem {
  id?: number
  text: string
  timestamp: number
}

export interface ClipboardAPI {
  getClipboardHistory: () => Promise<ClipboardItem[]>
  setClipboardContent: (content: string) => void
  clearClipboardHistory: () => void
  deleteClipboardItem: (id: number) => void
  onClipboardUpdated: (callback: (items: ClipboardItem[]) => void) => void
  removeClipboardListener: () => void
}

declare global {
  interface Window {
    api: ClipboardAPI
  }
}

declare module 'react' {
  interface CSSProperties {
    '-webkit-app-region'?: string;
  }
}
