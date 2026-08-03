import { Toaster } from './ui/sonner'
import Navbar from './Navbar'
import Footer from './Footer'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster position="bottom-right" closeButton richColors />
    </div>
  )
}

export default Layout
