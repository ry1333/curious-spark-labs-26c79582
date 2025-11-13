import { NavLink } from 'react-router-dom'
import { House, Wand2, BookOpen, User } from 'lucide-react'

const tabs = [
  { to: '/stream', label: 'Listen', Icon: House },
  { to: '/create', label: 'Create', Icon: Wand2 },
  { to: '/learn',  label: 'Learn',  Icon: BookOpen },
  { to: '/profile',label: 'Profile',Icon: User },
]

export default function BottomTabBar() {
  return (
    <nav className="md:hidden fixed bottom-4 inset-x-4 z-50">
      {/* Floating pill container */}
      <div className="max-w-md mx-auto rounded-full border border-line glass backdrop-blur-xl shadow-neon-cyan px-2 py-2">
        <ul className="grid grid-cols-4 gap-1">
          {tabs.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className="block"
              >
                {({ isActive }) => (
                  <div className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan/20 to-magenta/20'
                      : 'hover:bg-white/5'
                  }`}>
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute top-1 w-1 h-1 rounded-full bg-gradient-to-r from-cyan to-magenta animate-pulse shadow-glow-cyan" />
                    )}

                    {/* Icon with gradient on active */}
                    <div className="relative">
                      <Icon
                        size={20}
                        className={`transition-all duration-300 ${
                          isActive
                            ? 'text-cyan scale-110'
                            : 'text-muted'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      {/* Glow effect when active */}
                      {isActive && (
                        <div className="absolute inset-0 bg-cyan/30 blur-md rounded-full" />
                      )}
                    </div>

                    {/* Label */}
                    <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-text'
                        : 'text-muted'
                    }`}>
                      {label}
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
