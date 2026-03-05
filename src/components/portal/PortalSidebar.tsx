'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { path: '/portal', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/portal/projects', label: 'My Projects', icon: FolderKanban },
  { path: '/portal/submit-request', label: 'Submit Request', icon: PlusCircle },
  { path: '/portal/files', label: 'Files', icon: FileText },
]

interface PortalSidebarProps {
  collapsed: boolean
  onToggle: () => void
  onSignOut: () => void
}

export default function PortalSidebar({ collapsed, onToggle, onSignOut }: PortalSidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return pathname === path
    return pathname.startsWith(path)
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-[#0a0a0a] border-r border-border/40 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/40">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="text-lg font-bold tracking-tight text-foreground">THE COAST</span>
            <span className="text-primary text-2xl leading-none">.</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path, item.exact)

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                collapsed && 'justify-center'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border/40">
        <button
          onClick={onSignOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
