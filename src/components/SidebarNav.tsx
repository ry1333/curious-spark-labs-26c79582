import { NavLink } from 'react-router-dom'
import { House, Wand2, BookOpen, User, Disc3 } from 'lucide-react'
import { supabase } from '../integrations/supabase/client'
import { useEffect, useState } from 'react'

const items = [
  { to: '/stream', label: 'Listen', Icon: House },
  { to: '/create', label: 'Create', Icon: Wand2 },
  { to: '/learn',  label: 'Learn',  Icon: BookOpen },
  { to: '/profile',label: 'Profile',Icon: User },
]

export default function SidebarNav() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 border-r border-line bg-gradient-to-b from-surface via-ink to-ink backdrop-blur-xl p-4 animate-slide-in-left">
      <nav className="w-full flex flex-col">
        {/* Logo Header */}
        <div className="mb-8 flex items-center gap-2">
          <div className="relative">
            <Disc3 className="w-8 h-8 text-cyan animate-vinyl-spin" strokeWidth={2} />
            <div className="absolute inset-0 bg-cyan/20 blur-lg rounded-full animate-pulse-ring" />
          </div>
          <span className="font-bold text-2xl gradient-text tracking-tight">RMXR</span>
        </div>

        {/* User Info (if logged in) */}
        {user && (
          <div className="mb-6 pb-6 border-b border-line">
            <div className="flex items-center gap-3 p-2 rounded-xl glass hover:bg-white/10 transition-smooth cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center font-bold text-ink shadow-glow-cyan">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-surface" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text truncate">
                  @{user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-muted">Online</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <ul className="space-y-2 flex-1">
          {items.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 transition-smooth relative overflow-hidden ${
                    isActive
                      ? 'text-text'
                      : 'text-muted hover:text-text hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active gradient background */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-magenta/10 rounded-xl" />
                    )}

                    {/* Active gradient border */}
                    {isActive && (
                      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan to-magenta rounded-full shadow-glow-cyan" />
                    )}

                    {/* Icon with hover glow */}
                    <div className={`relative z-10 transition-smooth ${isActive ? 'text-cyan' : ''}`}>
                      <Icon size={20} strokeWidth={2.5} />
                      {isActive && (
                        <div className="absolute inset-0 bg-cyan/30 blur-md rounded-full" />
                      )}
                    </div>

                    {/* Label */}
                    <span className="relative z-10 font-medium">{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer Version */}
        <div className="pt-4 mt-4 border-t border-line">
          <div className="text-xs text-muted/50 text-center">
            v1.0.0
          </div>
        </div>
      </nav>
    </aside>
  )
}
