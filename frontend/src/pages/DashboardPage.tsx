import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '@/lib/api'
import { 
  CalendarDays, 
  CircleDollarSign, 
  ClipboardList, 
  PartyPopper, 
  Sparkles, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Plus,
  MoreVertical,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Booking = {
  id: number
  vendor_id: number
  event_date: string
  notes?: string | null
  total_amount?: number | null
  status: string
}

type BudgetItem = {
  id: number
  name: string
  category: string
  amount: number
  notes?: string | null
}

type Guest = {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  rsvp_status: string
}

type ChecklistItem = {
  id: number
  title: string
  is_completed: boolean
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending'>('all')
  const [budgetForm, setBudgetForm] = useState({ name: '', category: 'General', amount: '' })
  const [guestForm, setGuestForm] = useState({ name: '', email: '', rsvp_status: 'pending' })
  const [savingBudget, setSavingBudget] = useState(false)
  const [savingGuest, setSavingGuest] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [bookingsRes, budgetRes, guestsRes, checklistRes] = await Promise.all([
          api.get<Booking[]>('/api/bookings/'),
          api.get<BudgetItem[]>('/api/planner/budget'),
          api.get<Guest[]>('/api/planner/guests'),
          api.get<ChecklistItem[]>('/api/planner/checklist'),
        ])
        setBookings(bookingsRes.data)
        setBudgetItems(budgetRes.data)
        setGuests(guestsRes.data)
        setChecklist(checklistRes.data)
      } catch {
        toast.error('Session expired. Please login again.')
        localStorage.removeItem('token')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const totalSpent = useMemo(() => budgetItems.reduce((sum, item) => sum + item.amount, 0), [budgetItems])
  const pendingBookings = useMemo(() => bookings.filter(b => b.status === 'pending').length, [bookings])
  const filteredBookings = useMemo(() => {
    if (bookingFilter === 'pending') {
      return bookings.filter((b) => b.status === 'pending')
    }
    return bookings
  }, [bookings, bookingFilter])

  const toggleChecklistItem = async (item: ChecklistItem) => {
    try {
      const res = await api.put<ChecklistItem>(`/api/planner/checklist/${item.id}`, {
        is_completed: !item.is_completed,
      })
      setChecklist((prev) => prev.map((i) => (i.id === item.id ? res.data : i)))
    } catch {
      toast.error('Could not update checklist item.')
    }
  }

  const addBudgetItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(budgetForm.amount)
    if (!budgetForm.name || Number.isNaN(amount) || amount <= 0) {
      toast.error('Enter a valid budget name and amount.')
      return
    }
    setSavingBudget(true)
    try {
      const res = await api.post<BudgetItem>('/api/planner/budget', {
        name: budgetForm.name,
        category: budgetForm.category,
        amount,
      })
      setBudgetItems((prev) => [...prev, res.data])
      setBudgetForm({ name: '', category: 'General', amount: '' })
      toast.success('Budget item added.')
    } catch {
      toast.error('Could not add budget item.')
    } finally {
      setSavingBudget(false)
    }
  }

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestForm.name.trim()) {
      toast.error('Guest name is required.')
      return
    }
    setSavingGuest(true)
    try {
      const res = await api.post<Guest>('/api/planner/guests', {
        name: guestForm.name,
        email: guestForm.email || undefined,
        rsvp_status: guestForm.rsvp_status,
      })
      setGuests((prev) => [...prev, res.data])
      setGuestForm({ name: '', email: '', rsvp_status: 'pending' })
      toast.success('Guest added to your list.')
    } catch {
      toast.error('Could not add guest.')
    } finally {
      setSavingGuest(false)
    }
  }

  const downloadInvoice = async () => {
    if (bookings.length === 0) {
      toast.error('Create a booking first to download an invoice.')
      return
    }
    try {
      const bookingId = bookings[0].id
      const res = await api.get(`/api/planner/invoice/${bookingId}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${bookingId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error('Invoice download failed. Ensure reportlab is installed on the server.')
    }
  }

  const seedDefaultChecklist = async () => {
    const defaults = ['Finalize Venue', 'Confirm Catering Menu', 'Guest List Completion', 'Photography Deposit']
    try {
      const created = await Promise.all(
        defaults.map((title) => api.post<ChecklistItem>('/api/planner/checklist', { title })),
      )
      setChecklist(created.map((r) => r.data))
    } catch {
      toast.error('Could not initialize checklist.')
    }
  }

  const rsvpCount = useMemo(() => guests.filter((g) => g.rsvp_status === 'attending').length, [guests])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-[2rem]" />
          <Skeleton className="h-[400px] rounded-[2rem]" />
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12 md:px-8"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="gold" className="px-3">
              <Sparkles size={12} className="mr-1.5" /> Luxury Planning Active
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-brand-dark mb-2">Welcome Back</h1>
          <p className="text-muted-foreground max-w-lg">
            Your wedding orchestration hub. Manage your vendors, guests, and budget with absolute precision.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full" type="button" onClick={downloadInvoice}>
            <Download size={18} className="mr-2" /> Export Invoice
          </Button>
          <Link to="/vendors">
            <Button variant="luxury" className="rounded-full shadow-luxury">
              <Plus size={18} className="mr-2" /> Book Vendor
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card className="maroon-gradient text-white border-none">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <CalendarDays size={24} className="text-brand-gold" />
              </div>
              <Badge className="bg-white/10 text-white border-none">Active Bookings</Badge>
            </div>
            <p className="text-4xl font-bold mb-1">{bookings.length}</p>
            <p className="text-white/60 text-sm flex items-center">
              <TrendingUp size={14} className="mr-1" /> {pendingBookings} pending approval
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-border">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-beige rounded-2xl text-brand-maroon">
                <CircleDollarSign size={24} />
              </div>
              <Badge variant="gold">Wedding Budget</Badge>
            </div>
            <p className="text-4xl font-bold text-brand-dark mb-1">PKR {totalSpent.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">Allocated across {budgetItems.length} items</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-border">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-beige rounded-2xl text-brand-maroon">
                <Users size={24} />
              </div>
              <Badge variant="outline" className="border-brand-maroon/20 text-brand-maroon">Guest List</Badge>
            </div>
            <p className="text-4xl font-bold text-brand-dark mb-1">{guests.length}</p>
            <p className="text-muted-foreground text-sm flex items-center">
              <CheckCircle2 size={14} className="mr-1 text-green-600" /> {rsvpCount} confirmed attending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-luxury overflow-hidden">
            <CardHeader className="bg-brand-beige/30 border-b border-border/50 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Wedding Itinerary & Bookings</CardTitle>
                  <CardDescription>Track your service confirmations</CardDescription>
                </div>
                <Tabs
                  value={bookingFilter}
                  onValueChange={(v) => setBookingFilter(v as 'all' | 'pending')}
                  className="w-auto"
                >
                  <TabsList className="bg-white border border-border">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {bookings.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="bg-brand-beige w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-maroon">
                    <CalendarDays size={32} />
                  </div>
                  <h3 className="text-lg font-semibold">No bookings yet</h3>
                  <p className="text-muted-foreground mb-6">Start by exploring our curated luxury vendors.</p>
                  <Link to="/vendors">
                    <Button variant="outline">Browse Vendors</Button>
                  </Link>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No pending bookings.</div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-brand-beige/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center",
                          booking.status === 'confirmed' ? "bg-green-100 text-green-700" : "bg-brand-gold/10 text-brand-gold"
                        )}>
                          <Sparkles size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark">Booking #{booking.id}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                            <span className="flex items-center"><Clock size={14} className="mr-1" /> {new Date(booking.event_date).toLocaleDateString()}</span>
                            <span className="flex items-center"><ArrowUpRight size={14} className="mr-1" /> Vendor ID: {booking.vendor_id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-brand-dark">PKR {(booking.total_amount || 0).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">Est. Value</p>
                        </div>
                        <Badge className={cn(
                          "px-3 py-1 rounded-full uppercase text-[10px] tracking-widest font-bold",
                          booking.status === 'confirmed' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-brand-beige text-brand-maroon hover:bg-brand-beige"
                        )}>
                          {booking.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-luxury">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-lg">Budget Planner</CardTitle>
              <CardDescription>Track allocation by category</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              {budgetItems.length === 0 && (
                <p className="text-sm text-muted-foreground">No budget items yet. Add your first allocation below.</p>
              )}
              {budgetItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-brand-dark">{item.name}</span>
                  <span className="font-semibold text-brand-maroon">PKR {item.amount.toLocaleString()}</span>
                </div>
              ))}
              <form onSubmit={addBudgetItem} className="space-y-3 border-t border-border pt-4">
                <Input
                  placeholder="Item name"
                  value={budgetForm.name}
                  onChange={(e) => setBudgetForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Amount (PKR)"
                  value={budgetForm.amount}
                  onChange={(e) => setBudgetForm((f) => ({ ...f, amount: e.target.value }))}
                />
                <Button type="submit" variant="outline" className="w-full" disabled={savingBudget}>
                  {savingBudget ? 'Saving...' : 'Add Budget Item'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar area */}
        <div className="space-y-8">
          <Card className="border-none shadow-luxury">
            <CardHeader className="px-8 pt-8">
              <div className="flex items-center gap-2 text-brand-maroon mb-1">
                <ClipboardList size={18} />
                <CardTitle className="text-lg">Checklist</CardTitle>
              </div>
              <CardDescription>Your essential tasks</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4">
                {checklist.length === 0 ? (
                  <Button variant="outline" className="w-full" type="button" onClick={seedDefaultChecklist}>
                    Initialize Wedding Checklist
                  </Button>
                ) : (
                  checklist.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleChecklistItem(task)}
                      className="flex w-full items-center gap-3 group text-left"
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                          task.is_completed
                            ? 'bg-brand-gold border-brand-gold text-white'
                            : 'border-border group-hover:border-brand-gold',
                        )}
                      >
                        {task.is_completed && <CheckCircle2 size={12} />}
                      </div>
                      <span
                        className={cn(
                          'text-sm transition-colors',
                          task.is_completed
                            ? 'text-muted-foreground line-through'
                            : 'text-brand-dark font-medium',
                        )}
                      >
                        {task.title}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-luxury overflow-hidden">
             <CardHeader className="px-8 pt-8">
              <div className="flex items-center gap-2 text-brand-maroon mb-1">
                <PartyPopper size={18} />
                <CardTitle className="text-lg">Recent RSVPs</CardTitle>
              </div>
              <CardDescription>Latest guest confirmations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {guests.slice(0, 4).map((guest) => (
                  <div key={guest.id} className="px-8 py-4 flex items-center justify-between hover:bg-brand-beige/20 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{guest.name}</p>
                      <p className="text-xs text-muted-foreground">{guest.rsvp_status}</p>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      guest.rsvp_status === 'attending' ? "bg-green-500" : "bg-brand-gold"
                    )}></div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-brand-beige/30">
                <form onSubmit={addGuest} className="space-y-3 px-4 pb-2">
                  <Input
                    placeholder="Guest name"
                    value={guestForm.name}
                    onChange={(e) => setGuestForm((f) => ({ ...f, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Email (optional)"
                    value={guestForm.email}
                    onChange={(e) => setGuestForm((f) => ({ ...f, email: e.target.value }))}
                  />
                  <Button type="submit" variant="luxury" className="w-full" disabled={savingGuest}>
                    {savingGuest ? 'Adding...' : 'Add Guest'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardPage
