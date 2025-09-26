import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
export interface ClipboardItem {
  id?: number
  text: string
  timestamp: number
}

// Define the API object
const api = {
  // Clipboard operations
  getClipboardHistory: (): Promise<ClipboardItem[]> => ipcRenderer.invoke('get-clipboard-history'),
  setClipboardContent: (content: string): void => ipcRenderer.send('set-clipboard-content', content),
  clearClipboardHistory: (): void => ipcRenderer.send('clear-clipboard-history'),
  deleteClipboardItem: (id: number): void => ipcRenderer.send('delete-clipboard-item', id),
  onClipboardUpdated: (callback: (items: ClipboardItem[]) => void): void => {
    ipcRenderer.on('clipboard-updated', (_, items) => callback(items))
  },
  removeClipboardListener: (): void => {
    ipcRenderer.removeAllListeners('clipboard-updated')
  }
}

// Expose the API to the renderer process
try {
  console.log('Exposing API to renderer process...')
  contextBridge.exposeInMainWorld('api', api)
  console.log('API exposed successfully')
} catch (error) {
  console.error('Failed to expose API:', error)
}
