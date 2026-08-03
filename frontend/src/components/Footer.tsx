import { Link } from 'react-router-dom'
import { Crown, Sparkles, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { Separator } from './ui/separator'

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="rounded-full bg-brand-gold p-2 text-brand-maroon shadow-gold-glow">
                <Crown size={24} />
              </div>
              <div>
                <p className="font-serif text-2xl font-bold tracking-tight text-white leading-none">Desi Weddings</p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-brand-gold/80 font-semibold mt-1">Luxury Curation</p>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Crafting timeless Pakistani wedding experiences with elegance, tradition, and modern luxury. Your dream celebration, perfectly orchestrated.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-brand-gold font-semibold uppercase tracking-widest text-xs mb-8">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/vendors" className="text-white/60 hover:text-white transition-colors text-sm">Luxury Venues</Link></li>
              <li><Link to="/vendors?category=Cuisine" className="text-white/60 hover:text-white transition-colors text-sm">Catering Services</Link></li>
              <li><Link to="/vendors?category=Photography" className="text-white/60 hover:text-white transition-colors text-sm">Photography</Link></li>
              <li><Link to="/vendors?category=Decor" className="text-white/60 hover:text-white transition-colors text-sm">Decor & Florals</Link></li>
              <li><Link to="/dashboard" className="text-white/60 hover:text-white transition-colors text-sm">Planning Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold font-semibold uppercase tracking-widest text-xs mb-8">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">Our Process</Link></li>
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">Testimonials</Link></li>
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold font-semibold uppercase tracking-widest text-xs mb-8">Concierge</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">hello@desiweddings.pk</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">+92 21 3456 7890</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">Luxury Plaza, Karachi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2026 Desi Wedding Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Sparkles size={12} className="text-brand-gold" />
            Designed for the most elegant celebrations.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
