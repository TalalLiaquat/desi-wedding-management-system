import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Building2, Camera, Car, MapPin, Search, Sparkles, Star, Utensils } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

type Vendor = {
  id: number
  name: string
  category: string
  city?: string | null
  price?: number | null
  rating?: number | null
  description?: string | null
}

type PlannerCategory = {
  id: number
  name: string
  description?: string | null
}

const categoryIcons: Record<string, typeof Building2> = {
  Venues: Building2,
  Transport: Car,
  Cuisine: Utensils,
  Photography: Camera,
  Decor: Sparkles,
}

const vendorImages: Record<string, string> = {
  Venues: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
  Transport: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
  Cuisine: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
  Photography: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800',
  Decor: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
}

const VendorsPage = () => {
  const [searchParams] = useSearchParams()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [categories, setCategories] = useState<PlannerCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(searchParams.get('category'))
  const [city, setCity] = useState('')

  useEffect(() => {
    const fromQuery = searchParams.get('category')
    if (fromQuery) {
      setCategory(fromQuery)
    }
  }, [searchParams])

  useEffect(() => {
    const load = async () => {
      try {
        const [vendorRes, categoryRes] = await Promise.all([
          api.get<Vendor[]>('/api/vendors/', {
            params: {
              search: search || undefined,
              category: category || undefined,
              city: city || undefined,
              limit: 50,
            },
          }),
          api.get<PlannerCategory[]>('/api/planner/categories'),
        ])
        setVendors(vendorRes.data)
        setCategories(categoryRes.data)
      } catch {
        toast.error('Could not load vendors. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [search, category, city])

  const cities = useMemo(
    () => [...new Set(vendors.map((v) => v.city).filter(Boolean))] as string[],
    [vendors],
  )

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-border bg-brand-beige/40 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.15),_transparent_50%)]" />
        <div className="container relative mx-auto px-4 md:px-8">
          <Badge variant="gold" className="mb-4 px-4 py-1">
            <Sparkles size={14} className="mr-2" />
            Curated Luxury Vendors
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-brand-dark md:text-5xl">
            Discover <span className="text-brand-maroon">Exceptional</span> Partners
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Browse Pakistan&apos;s finest wedding venues, caterers, photographers, and more — vetted for quality and elegance.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:px-8">
        <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-border bg-white p-6 shadow-luxury lg:flex-row lg:items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by vendor name..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={category === null ? 'luxury' : 'outline'}
              size="sm"
              onClick={() => setCategory(null)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                type="button"
                variant={category === cat.name ? 'luxury' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
          {cities.length > 0 && (
            <select
              className="h-11 rounded-full border border-input bg-background px-4 text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 rounded-[2rem]" />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <Card className="border-none bg-brand-beige/30 p-16 text-center">
            <p className="text-lg text-muted-foreground">No vendors match your filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch('')
                setCategory(null)
                setCity('')
              }}
            >
              Clear filters
            </Button>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor, index) => {
              const Icon = categoryIcons[vendor.category] ?? Sparkles
              const image =
                vendorImages[vendor.category] ??
                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
              return (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden border-none shadow-luxury transition-all duration-500 hover:shadow-luxury-lg rounded-[2rem]">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={image}
                        alt={vendor.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
                      <Badge variant="gold" className="absolute left-4 top-4 text-[10px] uppercase tracking-widest">
                        {vendor.category}
                      </Badge>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 text-brand-gold">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-bold text-white">{vendor.rating ?? 4.8}</span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-brand-dark">{vendor.name}</h3>
                        <div className="rounded-xl bg-brand-beige p-2 text-brand-maroon">
                          <Icon size={18} />
                        </div>
                      </div>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {vendor.description ?? 'Premium wedding services tailored for grand celebrations.'}
                      </p>
                      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={16} className="text-brand-gold" />
                        {vendor.city ?? 'Pakistan'}
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                          <p className="font-bold text-brand-maroon">
                            PKR {(vendor.price ?? 0).toLocaleString()}
                          </p>
                        </div>
                        <Link to={`/vendors/${vendor.id}`}>
                          <Button variant="luxury" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorsPage
