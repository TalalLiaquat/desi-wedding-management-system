import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  LayoutGrid,
  Users,
  Store,
  CalendarDays,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Plus,
  Download,
  TrendingUp,
  DollarSign,
  MessageSquareQuote,
  BellRing,
} from 'lucide-react'

type Vendor = {
  id: number
  name: string
  category: string
  city: string | null
  price: number | null
  rating: number | null
  description: string | null
}

type Booking = {
  id: number
  user_id: number
  vendor_id: number
  event_date: string
  notes?: string | null
  total_amount?: number | null
  status: string
  created_at: string
}

type User = {
  id: number
  full_name: string
  email: string
  role: string
}

type Review = {
  id: number
  vendor_id: number
  rating: number
  comment?: string | null
}

type Payment = {
  id: number
  amount: number
  cardholder_name: string
  card_last4: string
  status: string
}

type PlannerItem = {
  id: number
  title: string
  is_completed: boolean
}

const AdminPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([])
  const [search, setSearch] = useState('')
  const [vendorForm, setVendorForm] = useState({ name: '', category: 'Venues', city: '', price: '', rating: '4.8', description: '' })
  const [bookingFilter, setBookingFilter] = useState('all')
  const [savingVendor, setSavingVendor] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'bookings' | 'users' | 'planner' | 'payments' | 'reviews'>('overview')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [vendorsRes, bookingsRes, usersRes, reviewsRes, paymentsRes, plannerRes] = await Promise.all([
          api.get<Vendor[]>('/api/vendors/'),
          api.get<Booking[]>('/api/bookings/'),
          api.get<User[]>('/api/users/'),
          api.get<Review[]>('/api/planner/reviews'),
          api.get<Payment[]>('/api/planner/payments'),
          api.get<PlannerItem[]>('/api/planner/checklist'),
        ])
        setVendors(vendorsRes.data)
        setBookings(bookingsRes.data)
        setUsers(usersRes.data)
        setReviews(reviewsRes.data)
        setPayments(paymentsRes.data)
        setPlannerItems(plannerRes.data)
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Could not load admin data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const filteredVendors = useMemo(() => {
    const query = search.toLowerCase()
    return vendors.filter((vendor) => vendor.name.toLowerCase().includes(query) || vendor.category.toLowerCase().includes(query))
  }, [search, vendors])

  const filteredBookings = useMemo(() => {
    if (bookingFilter === 'all') return bookings
    return bookings.filter((booking) => booking.status === bookingFilter)
  }, [bookingFilter, bookings])

  const stats = useMemo(() => ({
    bookings: bookings.length,
    vendors: vendors.length,
    users: users.length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
    revenue: bookings.reduce((total, booking) => total + (booking.total_amount ?? 0), 0),
    avgRating: reviews.length ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1) : '0.0',
  }), [bookings, reviews, users, vendors])

  const createVendor = async (event: React.FormEvent) => {
    event.preventDefault()
    setSavingVendor(true)
    try {
      const payload = {
        name: vendorForm.name,
        category: vendorForm.category,
        city: vendorForm.city || null,
        price: Number(vendorForm.price) || null,
        rating: Number(vendorForm.rating) || null,
        description: vendorForm.description || null,
      }
      const response = await api.post<Vendor>('/api/vendors/', payload)
      setVendors((prev) => [response.data, ...prev])
      setVendorForm({ name: '', category: 'Venues', city: '', price: '', rating: '4.8', description: '' })
      toast.success('Vendor created successfully.')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Vendor creation failed.')
    } finally {
      setSavingVendor(false)
    }
  }

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      const response = await api.put<Booking>(`/api/bookings/${bookingId}`, { status })
      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? response.data : booking)))
      toast.success(`Booking marked as ${status}.`)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Unable to update booking status.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-4">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-32 rounded-[2rem]" />)}</div>
        <Skeleton className="h-[420px] rounded-[2rem]" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12 md:px-8">
      <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-brand-gold/30 bg-gradient-to-r from-brand-maroon via-[#861b38] to-[#a51f44] p-8 text-white shadow-luxury">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-brand-gold">
              <ShieldCheck size={16} /> Admin control center
            </div>
            <h1 className="text-3xl font-bold">Luxury operations dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">Oversight across vendors, bookings, users, and planner workflows for premium wedding events.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => toast.success('Admin queue synced.')}>Sync Queue</Button>
            <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate('/dashboard')}>Back to Client Hub</Button>
          </div>
        </div>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {[
          ['overview', 'Overview'],
          ['vendors', 'Vendors'],
          ['bookings', 'Bookings'],
          ['users', 'Users'],
          ['planner', 'Planner'],
          ['payments', 'Payments'],
          ['reviews', 'Reviews'],
        ].map(([key, label]) => (
          <Button key={key} variant={activeTab === key ? 'luxury' : 'outline'} size="sm" onClick={() => setActiveTab(key as any)}>{label}</Button>
        ))}
      </div>

      <section className="mb-8 grid gap-6 md:grid-cols-4">
        <Card className="border-brand-gold/20 bg-white/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total bookings</p>
                <p className="text-2xl font-semibold text-brand-dark">{stats.bookings}</p>
              </div>
              <CalendarDays className="text-brand-maroon" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-brand-gold/20 bg-white/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendors</p>
                <p className="text-2xl font-semibold text-brand-dark">{stats.vendors}</p>
              </div>
              <Store className="text-brand-maroon" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-brand-gold/20 bg-white/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-semibold text-brand-dark">{stats.users}</p>
              </div>
              <Users className="text-brand-maroon" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-brand-gold/20 bg-white/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue pipeline</p>
                <p className="text-2xl font-semibold text-brand-dark">PKR {stats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="text-brand-maroon" />
            </div>
          </CardContent>
        </Card>
      </section>

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent bookings</CardTitle>
              <CardDescription>Latest requests awaiting your decision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-brand-beige/30 p-4">
                  <div>
                    <p className="font-semibold text-brand-dark">Booking #{booking.id}</p>
                    <p className="text-sm text-muted-foreground">Vendor #{booking.vendor_id} • {new Date(booking.event_date).toLocaleDateString()}</p>
                  </div>
                  <Badge className="uppercase">{booking.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent users</CardTitle>
              <CardDescription>New client and admin accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-brand-beige/30 p-4">
                  <div>
                    <p className="font-semibold text-brand-dark">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Vendor management</CardTitle>
              <CardDescription>Search, approve, or add luxury vendors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vendors" className="pl-9" />
              </div>
              <div className="space-y-3">
                {filteredVendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between rounded-2xl border border-border/60 p-4">
                    <div>
                      <p className="font-semibold text-brand-dark">{vendor.name}</p>
                      <p className="text-sm text-muted-foreground">{vendor.category} • {vendor.city || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{vendor.rating?.toFixed(1) || '0.0'}</Badge>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Add vendor</CardTitle>
              <CardDescription>Create a premium partner listing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createVendor} className="space-y-3">
                <Input placeholder="Vendor name" value={vendorForm.name} onChange={(event) => setVendorForm((prev) => ({ ...prev, name: event.target.value }))} required />
                <Input placeholder="Category" value={vendorForm.category} onChange={(event) => setVendorForm((prev) => ({ ...prev, category: event.target.value }))} required />
                <Input placeholder="City" value={vendorForm.city} onChange={(event) => setVendorForm((prev) => ({ ...prev, city: event.target.value }))} />
                <Input type="number" placeholder="Price" value={vendorForm.price} onChange={(event) => setVendorForm((prev) => ({ ...prev, price: event.target.value }))} />
                <Input type="number" step="0.1" placeholder="Rating" value={vendorForm.rating} onChange={(event) => setVendorForm((prev) => ({ ...prev, rating: event.target.value }))} />
                <Input placeholder="Description" value={vendorForm.description} onChange={(event) => setVendorForm((prev) => ({ ...prev, description: event.target.value }))} />
                <Button type="submit" variant="luxury" className="w-full" disabled={savingVendor}>{savingVendor ? 'Saving...' : 'Create Vendor'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'bookings' && (
        <Card>
          <CardHeader>
            <CardTitle>Booking management</CardTitle>
            <CardDescription>Review, approve, reject, or complete bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'rejected', 'completed'].map((status) => (
                <Button key={status} size="sm" variant={bookingFilter === status ? 'luxury' : 'outline'} onClick={() => setBookingFilter(status)}>{status}</Button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 p-4">
                  <div>
                    <p className="font-semibold text-brand-dark">Booking #{booking.id}</p>
                    <p className="text-sm text-muted-foreground">Vendor #{booking.vendor_id} • {new Date(booking.event_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{booking.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, 'rejected')}>Reject</Button>
                    <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, 'completed')}>Complete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User management</CardTitle>
            <CardDescription>Manage customer and admin access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between rounded-2xl border border-border/60 p-4">
                <div>
                  <p className="font-semibold text-brand-dark">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{user.role}</Badge>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Delete</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'planner' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Planner checklist</CardTitle>
              <CardDescription>Track milestone completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {plannerItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border/60 p-4">
                  <span className="font-medium text-brand-dark">{item.title}</span>
                  {item.is_completed ? <CheckCircle2 className="text-green-600" /> : <ClockIcon />}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Planner notifications</CardTitle>
              <CardDescription>Luxury event reminders and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-brand-beige/30 p-4">
                <div className="flex items-center gap-2 text-brand-maroon"><BellRing size={16} /> Client briefing ready</div>
                <p className="mt-2 text-sm text-muted-foreground">A curated planner update is ready for review.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>Payments & invoices</CardTitle>
            <CardDescription>Track payments and download invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex flex-wrap items-center justify-between rounded-2xl border border-border/60 p-4">
                <div>
                  <p className="font-semibold text-brand-dark">{payment.cardholder_name}</p>
                  <p className="text-sm text-muted-foreground">•••• {payment.card_last4}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{payment.status}</Badge>
                  <Button size="sm" variant="outline"><Download size={16} className="mr-2" /> Invoice</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'reviews' && (
        <Card>
          <CardHeader>
            <CardTitle>Review management</CardTitle>
            <CardDescription>Track vendor feedback and average satisfaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-border/60 bg-brand-beige/30 p-4">
              <div className="flex items-center gap-2 text-brand-maroon"><TrendingUp size={16} /> Average rating: {stats.avgRating}/5</div>
            </div>
            {reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-brand-dark">Vendor #{review.vendor_id}</p>
                  <Badge>{review.rating}/5</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment || 'No comments provided.'}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

function ClockIcon() {
  return <div className="h-4 w-4 rounded-full border border-brand-gold" />
}

export default AdminPage
