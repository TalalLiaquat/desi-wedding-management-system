import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-brand-50 px-6 py-16">
    <div className="max-w-xl rounded-[2rem] border border-brand-100 bg-white/90 p-10 text-center shadow-2xl shadow-brand-200/20">
      <p className="text-sm uppercase tracking-[0.35em] text-brand-600">404 error</p>
      <h1 className="mt-4 text-5xl font-semibold text-slate-950">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist. Return to the homepage to continue planning your wedding.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-brand-700 px-8 py-3 text-white transition hover:bg-brand-800">
        Back to Home
      </Link>
    </div>
  </main>
)

export default NotFoundPage
