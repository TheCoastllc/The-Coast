'use client'

import { useState, ReactNode } from 'react'
import { useClientAuth } from '@/hooks/use-client-auth'
import PortalSidebar from './PortalSidebar'
import { cn } from '@/lib/utils'
import { Loader2, Menu } from 'lucide-react'

interface PortalLayoutProps {
  children: ReactNode
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { client, isLoading, signOut } = useClientAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!client) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#0a0a0a] border-b border-border/40 flex items-center px-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1 ml-3">
          <span className="text-lg font-bold tracking-tight text-foreground">THE COAST</span>
          <span className="text-primary text-2xl leading-none">.</span>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:block">
        <PortalSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onSignOut={signOut}
        />
      </div>

      {/* Sidebar - mobile */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <PortalSidebar
          collapsed={false}
          onToggle={() => setMobileOpen(false)}
          onSignOut={signOut}
        />
      </div>

      {/* Main content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 pt-14 lg:pt-0',
          collapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
