import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import api from '@/lib/api'

const ProtectedAdminRoute = () => {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    const token = localStorage.getItem('token')

    if (!token) {
      setIsAdmin(false)
      setLoading(false)
      return () => {
        isMounted = false
      }
    }

    api.get('/api/auth/me')
      .then((response) => {
        if (!isMounted) return
        const role = response.data.role
        localStorage.setItem('userRole', role)
        setIsAdmin(role === 'admin')
      })
      .catch(() => {
        if (!isMounted) return
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        setIsAdmin(false)
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [location.pathname])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-brand-gold/30 bg-white/80 px-6 py-3 text-brand-maroon shadow-luxury">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verifying admin access...
        </div>
      </div>
    )
  }

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}

export default ProtectedAdminRoute
