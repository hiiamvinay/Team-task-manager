import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LandingPage from './pages/LandingPage/LandingPage'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import OTP from './pages/OTP/OTP'
import Dashboard from './pages/Dashboard/Dashboard'
import ProjectManagement from './pages/ProjectManagement/ProjectManagement'
import TaskManagement from './pages/TaskManagement/TaskManagement'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/tasks" element={<TaskManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
