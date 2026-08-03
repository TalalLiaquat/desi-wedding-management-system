import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '@/lib/api'
import { Crown, ArrowRight, User, Mail, Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/auth/register', {
        full_name: fullName,
        email,
        password,
      })
      toast.success('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden bg-brand-beige/30">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-maroon/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-maroon text-brand-gold shadow-luxury mb-4">
            <Crown size={32} />
          </div>
          <h1 className="text-3xl font-bold text-brand-dark">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">Start your journey to an unforgettable celebration</p>
        </div>

        <Card className="border-none shadow-luxury-lg glass bg-white/80">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl">Join Desi Weddings</CardTitle>
            <CardDescription>Enter your details to create your luxury profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
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
                    placeholder="Create Password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground px-1 mb-2">
                By clicking "Create Account", you agree to our <span className="text-brand-maroon underline cursor-pointer">Terms</span> and <span className="text-brand-maroon underline cursor-pointer">Privacy Policy</span>.
              </div>

              <Button type="submit" className="w-full" variant="luxury" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-maroon font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          <Sparkles size={12} className="text-brand-gold" />
          Designed for the most elegant celebrations
          <Sparkles size={12} className="text-brand-gold" />
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
