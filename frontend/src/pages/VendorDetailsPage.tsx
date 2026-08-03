import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { 
  BadgeCheck, 
  MapPin, 
  Star, 
  WalletCards, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Info,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Vendor = {
  id: number
  name: string
  category: string
  city?: string | null
  price?: number | null
  rating?: number | null
  description?: string | null
}

type Review = {
  id: number
  rating: number
  comment?: string | null
}

const VendorDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [eventDate, setEventDate] = useState('')
  const [notes, setNotes] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorRes, reviewRes] = await Promise.all([
          api.get<Vendor>(`/api/vendors/${id}`),
          api.get<Review[]>('/api/planner/reviews', { params: { vendor_id: id } }),
        ])
        setVendor(vendorRes.data)
        setReviews(reviewRes.data)
      } catch (err) {
        toast.error('Failed to load vendor details.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleBooking = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please sign in to request a booking.')
      navigate('/login')
      return
    }
    if (!eventDate) {
      toast.error('Please select your event date.')
      return
    }
    setBookingLoading(true)
    try {
      await api.post('/api/bookings/', {
        vendor_id: Number(id),
        event_date: new Date(eventDate).toISOString(),
        notes: notes || undefined,
        total_amount: vendor?.price ?? undefined,
      })
      toast.success('Booking request submitted! View it on your dashboard.')
      navigate('/dashboard')
    } catch {
      toast.error('Could not submit booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Vendor not found</h2>
        <Link to="/" className="mt-4 inline-block text-brand-maroon underline">Return home</Link>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-24"
    >
      {/* Header Info */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/vendors" className="hover:text-brand-maroon transition-colors">Vendors</Link>
            <ChevronRight size={14} />
            <span className="capitalize">{vendor.category}</span>
            <ChevronRight size={14} />
            <span className="text-brand-dark font-medium">{vendor.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="gold" className="px-3 uppercase tracking-widest text-[10px] font-bold">
                  {vendor.category}
                </Badge>
                <div className="flex items-center text-brand-gold gap-1 text-sm font-bold">
                  <Star size={16} fill="currentColor" />
                  {vendor.rating || 4.8}
                  <span className="text-muted-foreground font-normal ml-1">({reviews.length} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">{vendor.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin size={18} className="text-brand-gold" /> {vendor.city || 'Available Nationwide'}</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1.5"><ShieldCheck size={18} className="text-brand-maroon" /> Verified Luxury Vendor</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 size={18} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Heart size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Gallery Placeholder */}
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem]">
            <img 
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover" 
              alt="Main"
            />
          </div>
          <div className="hidden md:block relative overflow-hidden rounded-[2rem]">
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="G1" />
          </div>
          <div className="hidden md:block relative overflow-hidden rounded-[2rem]">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="G2" />
          </div>
          <div className="hidden md:block relative overflow-hidden rounded-[2rem]">
            <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="G3" />
          </div>
          <div className="hidden md:block relative overflow-hidden rounded-[2rem]">
            <img src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="G4" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                <Info size={24} className="text-brand-maroon" /> About this vendor
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {vendor.description || `Experience the ultimate in ${vendor.category.toLowerCase()} luxury. Our team specializes in delivering high-end experiences tailored for grand Pakistani celebrations. From the initial consultation to the final execution, we ensure every detail reflects your vision of elegance.`}
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-6">What this vendor offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Premium service guarantee',
                  'Dedicated event coordinator',
                  'Customized luxury packages',
                  'Nationwide availability',
                  'Award-winning hospitality',
                  'Expert craftsmanship'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                    <span className="text-brand-dark font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
               <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-brand-dark">Client Reviews</h2>
                <div className="flex items-center text-brand-gold gap-1 text-lg font-bold">
                  <Star size={20} fill="currentColor" />
                  {vendor.rating || 4.8}
                  <span className="text-muted-foreground font-normal ml-2">({reviews.length} reviews)</span>
                </div>
              </div>
              
              {reviews.length === 0 ? (
                <Card className="bg-brand-beige/30 border-none p-12 text-center">
                  <p className="text-muted-foreground">No reviews yet for this vendor.</p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-border shadow-sm rounded-3xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex text-brand-gold">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < (review.rating || 0) ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Verified Client</span>
                        </div>
                        <p className="text-brand-dark leading-relaxed">
                          {review.comment || "The service was absolutely exceptional. Highly recommended for anyone looking for true luxury for their wedding."}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="relative">
            <Card className="sticky top-32 border-none shadow-luxury-lg rounded-[2.5rem] overflow-hidden">
              <div className="maroon-gradient p-8 text-white">
                <p className="text-white/60 text-sm uppercase tracking-widest font-bold mb-2">Starting from</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">PKR {vendor.price?.toLocaleString() || '150,000'}</span>
                  <span className="text-white/60">/ event</span>
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border p-4 bg-brand-beige/20">
                    <div className="flex items-center gap-3 text-brand-maroon font-bold text-sm mb-2 uppercase tracking-wider">
                      <Calendar size={16} />
                      Event Date
                    </div>
                    <Input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-brand-beige/20">
                    <div className="flex items-center gap-3 text-brand-maroon font-bold text-sm mb-2 uppercase tracking-wider">
                      <Sparkles size={16} />
                      Special Notes
                    </div>
                    <Input
                      placeholder="Guest count, preferences..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  variant="luxury"
                  size="lg"
                  className="w-full text-lg h-14"
                  type="button"
                  disabled={bookingLoading}
                  onClick={handleBooking}
                >
                  {bookingLoading ? 'Submitting...' : 'Request Booking'}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  You won't be charged yet. Final quote will be shared after consultation.
                </p>

                <Separator />

                <div className="space-y-4">
                   <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Luxury Service Fee</span>
                    <span className="font-bold">PKR 0</span>
                  </div>
                   <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Consultation</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 flex items-center justify-center gap-4 p-6 bg-brand-beige/50 rounded-[2rem]">
              <ShieldCheck size={32} className="text-brand-gold" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p className="font-bold text-brand-dark uppercase tracking-widest mb-1">Luxury Protection</p>
                Trusted payment and quality guarantee for all bookings.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VendorDetailsPage
