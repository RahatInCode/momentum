import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvider } from './components/context/AuthProvider'
import { useAuth } from './components/context/AuthContext'
import { NotificationProvider } from './components/context/NotificationProvider'
import { NotificationToast } from './components/notifications/NotificationToast'
import { HabitProvider } from './components/context/HabitProvider'
import { RoutineProvider } from './components/context/RoutineProvider'
import { AuthForm } from './components/auth/AuthForm'
import { useHabitReminders } from './hooks/useHabitReminder'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import {HabitsPage} from './pages/HabitsPage'
import {RoutinePage} from './pages/RoutinePage'
import {SocialPage} from './pages/SocialPage'
import { SettingsPage } from './pages/SettingsPage'

const AppContent = () => {
  const { user, loading } = useAuth()

  useHabitReminders()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0">
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <>
      <NotificationToast />
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/community" element={<SocialPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <HabitProvider>
            <RoutineProvider>
              <AppContent />
            </RoutineProvider>
          </HabitProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App