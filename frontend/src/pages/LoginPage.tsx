import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '@/lib/api'
import { Crown, ArrowRight, Mail, Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)

      const response = await api.post('/api/auth/login', formData)
      localStorage.setItem('token', response.data.access_token)
      try {
        const me = await api.get('/api/auth/me')
        localStorage.setItem('userRole', me.data.role)
      } catch {
        localStorage.removeItem('userRole')
      }
      toast.success('Welcome back to Desi Weddings!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden bg-brand-beige/30">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-maroon/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-maroon text-brand-gold shadow-luxury mb-4">
            <Crown size={32} />
          </div>
          <h1 className="text-3xl font-bold text-brand-dark">Sign In</h1>
          <p className="text-muted-foreground mt-2">Access your luxury planning suite</p>
        </div>

        <Card className="border-none shadow-luxury-lg glass bg-white/80">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" variant="luxury" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-brand-maroon font-semibold hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          <Sparkles size={12} className="text-brand-gold" />
          The gold standard in wedding planning
          <Sparkles size={12} className="text-brand-gold" />
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
