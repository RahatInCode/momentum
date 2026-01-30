import { Navigation } from './Navigation'

export const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <main className="flex-1 pb-20">
        <div className="max-w-lg mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      <Navigation />
    </div>
  )
}