import { ArrowRight, Star, CheckCircle2, Crown, Sparkles, MapPin, Camera, Utensils, Building2, Car } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

const services = [
  { 
    title: 'Grand Venues', 
    description: 'Palatial marquees and luxury halls curated for grand celebrations.', 
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'
  },
  { 
    title: 'Gourmet Catering', 
    description: 'Traditional Pakistani menus with a modern fine-dining twist.', 
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800'
  },
  { 
    title: 'Cinematography', 
    description: 'Editorial photography and cinematic storytelling for your big day.', 
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800'
  },
  { 
    title: 'Luxury Transport', 
    description: 'Premium fleet for the baraat, guests, and bridal entrances.', 
    icon: Car,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
  },
]

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(26,26,26,0.4)_100%)] z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Wedding" 
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
            style={{ animationDuration: '20s' }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <Badge variant="gold" className="mb-6 px-4 py-1 text-sm">
              <Sparkles size={14} className="mr-2" />
              Pakistan's Premier Wedding Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-brand-dark mb-6 leading-tight">
              Elegance in <span className="text-brand-maroon">Every Detail.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Experience the pinnacle of wedding planning. From majestic venues to gourmet cuisine, we curate the extraordinary for your dream celebration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button variant="luxury" size="lg" className="w-full sm:w-auto">
                  Begin Your Journey <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/vendors">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                  Explore Venues
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-8 border-l-2 border-brand-gold/30 pl-8">
              <div>
                <p className="text-3xl font-bold text-brand-maroon">250+</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Weddings Curated</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-maroon">4.9/5</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Client Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-maroon">40+</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Premium Vendors</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <p className="text-brand-gold font-semibold uppercase tracking-[0.3em] text-sm mb-4">Our Services</p>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                Crafting Timeless <span className="text-gradient-gold">Experiences</span>
              </h2>
            </div>
            <Link to="/vendors">
              <Button variant="link" className="text-brand-maroon p-0 h-auto text-lg group">
                View all services <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group overflow-hidden border-none shadow-none hover:shadow-luxury transition-all duration-500 rounded-[2.5rem]">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white">
                        <service.icon size={24} />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8 pt-6">
                    <h3 className="text-2xl font-bold text-brand-dark mb-3">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-brand-beige/50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-maroon/10 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200" 
                alt="Planning" 
                className="rounded-[3rem] shadow-luxury-lg relative z-10"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[2rem] shadow-luxury z-20 hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-maroon flex items-center justify-center text-brand-gold">
                    <Crown size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark">Premium Quality</p>
                    <div className="flex text-brand-gold">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Certified luxury vendors only.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <Badge variant="maroon" className="mb-4">Why Desi Weddings</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                  Modern Planning for <span className="text-brand-maroon">Traditional</span> Celebrations
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We blend heritage with cutting-edge technology to give you a seamless planning experience. Manage every aspect of your wedding from a single, beautiful dashboard.
              </p>
              <div className="space-y-4">
                {[
                  'Curated selection of Pakistan\'s top 1% vendors',
                  'Interactive budget and guest management tools',
                  'Real-time booking and availability tracking',
                  'Luxury design aesthetic for your digital invitations'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="bg-brand-gold/20 p-1 rounded-full text-brand-gold">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="font-medium text-brand-dark">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/vendors">
                <Button variant="luxury" size="lg">
                  Explore The Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4 md:px-8">
        <div className="relative rounded-[4rem] overflow-hidden maroon-gradient p-12 md:p-24 text-center">
          <div className="absolute top-0 right-0 p-12 text-brand-gold/10 pointer-events-none">
            <Crown size={300} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to plan your masterpiece?</h2>
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              Join hundreds of couples who have trusted us to orchestrate their most precious moments. Your dream wedding starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register">
                <Button variant="gold" size="lg" className="px-12">Create Account</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10 hover:text-white px-12">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
