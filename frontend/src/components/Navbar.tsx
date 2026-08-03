import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Crown, Menu, X, User, Heart, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const Navbar = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Vendors', to: '/vendors' },
    { label: 'Dashboard', to: '/dashboard' },
  ]

  const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('userRole') === 'admin' : false

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setMobileMenuOpen(false)
    navigate('/login')
  }

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [location.pathname])

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-border py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-brand-gold rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-full bg-brand-maroon p-2 text-brand-gold shadow-luxury">
              <Crown size={20} className="transition-transform group-hover:rotate-12" />
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="font-serif text-xl font-bold tracking-tight text-brand-maroon leading-none">Desi Weddings</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Luxury Curation</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 bg-white/50 backdrop-blur-sm border border-border px-6 py-2 rounded-full shadow-sm">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-maroon",
                  location.pathname === item.to ? "text-brand-maroon" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth / Profile */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-brand-maroon">
            <Search size={20} />
          </Button>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  <User size={16} />
                  Dashboard
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="luxury" size="sm" className="hidden sm:flex gap-2">
                    <Crown size={16} />
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" className="hidden sm:flex text-brand-maroon" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-brand-maroon">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="luxury" size="sm">Register</Button>
              </Link>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-border p-6 md:hidden animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-medium py-2 border-b border-muted/30",
                  location.pathname === item.to ? "text-brand-maroon" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="luxury" className="w-full">Admin Console</Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="luxury" className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
