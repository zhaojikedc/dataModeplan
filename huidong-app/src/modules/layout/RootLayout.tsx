import { Outlet, NavLink } from 'react-router-dom'
import { Logo } from '../shared/Logo'

export function RootLayout() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="font-semibold text-slate-900">慧动</span>
          </NavLink>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/assessment" className={({ isActive }) => isActive ? 'text-brand-600 font-medium' : 'text-slate-700 hover:text-slate-900'}>
              性格评估
            </NavLink>
            <NavLink to="/plan" className={({ isActive }) => isActive ? 'text-brand-600 font-medium' : 'text-slate-700 hover:text-slate-900'}>
              个性化计划
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} 慧动 · 因材施教，慧动未来
      </footer>
    </div>
  )
}

