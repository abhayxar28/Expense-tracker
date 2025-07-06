import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/auth/signup-page'
import SigninPage from './pages/auth/signin-page'
import Dashboard from './pages/dashboard/dashboard' // <-- contains <Outlet />
import DashboardComponent from './components/dashboard/DashboardComponent'
import IncomeComponent from './components/income/IncomeComponent'
import ExpenseComponent from './components/expenses/ExpenseComponent'
import AiAnalysisComponent from './components/ai/AiAnalysisComponent'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardComponent />} />
          <Route path="income" element={<IncomeComponent />} />
          <Route path="expense" element={<ExpenseComponent />} />
          <Route path="ai-analysis" element={<AiAnalysisComponent />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SigninPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
