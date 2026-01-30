import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { HabitsPage } from './pages/HabitsPage'
import { RoutinePage } from './pages/RoutinePage'
import { SocialPage } from './pages/SocialPage'
import { HabitProvider } from './context/HabitContext'
import { RoutineProvider } from './context/RoutineContext'

function App() {
  return (
    <BrowserRouter>
      <HabitProvider>
        <RoutineProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/routine" element={<RoutinePage />} />
              <Route path="/community" element={<SocialPage />} />
            </Routes>
          </AppShell>
        </RoutineProvider>
      </HabitProvider>
    </BrowserRouter>
  )
}

export default App