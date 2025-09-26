import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

// Define the ClipboardItem type
export interface ClipboardItem {
  id?: number
  text: string
  timestamp: number
}

class ClipboardDatabase {
  private db: Database.Database
  private static instance: ClipboardDatabase

  private constructor() {
    const dbPath = join(app.getPath('userData'), 'clipboard.db')
    this.db = new Database(dbPath)
    this.init()
  }

  public static getInstance(): ClipboardDatabase {
    if (!ClipboardDatabase.instance) {
      ClipboardDatabase.instance = new ClipboardDatabase()
    }
    return ClipboardDatabase.instance
  }

  private init(): void {
    // Create the clipboard_history table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS clipboard_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      )
    `)
  }

  public addItem(text: string): void {
    const stmt = this.db.prepare('INSERT INTO clipboard_history (text, timestamp) VALUES (?, ?)')
    stmt.run(text, Date.now())
  }

  public getHistory(limit: number = 50): ClipboardItem[] {
    const stmt = this.db.prepare('SELECT * FROM clipboard_history ORDER BY timestamp DESC LIMIT ?')
    return stmt.all(limit) as ClipboardItem[]
  }

  public clearHistory(): void {
    const stmt = this.db.prepare('DELETE FROM clipboard_history')
    stmt.run()
  }

  public deleteItem(id: number): void {
    const stmt = this.db.prepare('DELETE FROM clipboard_history WHERE id = ?')
    stmt.run(id)
  }
}

export const clipboardDB = ClipboardDatabase.getInstance()