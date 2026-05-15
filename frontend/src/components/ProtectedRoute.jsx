import { Navigate, Outlet, useLocation } from 'react-router-dom'

function isTokenValid(token) {
  if (!token) {
    return false
  }

  try {
    const payloadPart = token.split('.')[1]

    if (!payloadPart) {
      return false
    }

    const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(normalizedPayload))

    if (!payload.exp) {
      return false
    }

    return payload.exp * 1000 > Date.now()
  } catch (error) {
    return false
  }
}

function ProtectedRoute() {
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (!isTokenValid(token)) {
    localStorage.removeItem('token')

    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
