# Tacotac - Modern Clipboard Manager

Tacotac is a sleek and efficient clipboard manager built with Electron, React, and TypeScript. It helps you keep track of your clipboard history and quickly access previously copied items.

## Features

- 📋 Clipboard History Tracking
- 🚀 Quick Access to Previous Clips
- 💻 Always-on-Top Window
- 🎨 Modern UI with TailwindCSS
- 🔒 Local Storage for Privacy
- ⌨️ Cross-Platform Support (Windows, macOS, Linux)

## Why Tacotac?

Managing multiple clipboard items can be challenging when working with various pieces of text or content. Tacotac solves this by maintaining a history of your clipboard, allowing you to easily access and reuse previously copied items without the need to copy them again.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tacotac.git

# Navigate to the project directory
cd tacotac

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

### Building the Application

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

## Project Structure

```
src/
├── main/          # Electron main process
├── preload/       # Preload scripts
└── renderer/      # React application (UI)
```

## Tech Stack

- Electron - Cross-platform desktop application framework
- React - UI library
- TypeScript - Type-safe JavaScript
- TailwindCSS - Utility-first CSS framework
- SQLite - Local database for clipboard history

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Electron and React
