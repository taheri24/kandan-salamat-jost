import '../styles/globals.scss'
import { BoardProvider } from '@/contexts/BoardContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <BoardProvider>
          {children}
        </BoardProvider>
      </body>
    </html>
  )
}