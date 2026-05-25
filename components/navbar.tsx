'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Session } from '@supabase/supabase-js'

export function Navbar({ isDashboard = false }: { isDashboard?: boolean }) {
  const [user, setUser] = useState<Session | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  
  // Only create client after mount and if env vars exist
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? createClient() : null

  useEffect(() => {
    setMounted(true)
    if (!supabase) return
    
    async function getUser() {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session ?? null)
      } catch (error) {
        console.error('[v0] Error getting session:', error)
      }
    }
    getUser()
  }, [supabase])

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    closeMobile()
    router.push('/')
  }

  return (
    <nav className="w-full border-b border-border bg-background sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2" onClick={closeMobile}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Y</span>
            </div>
            <span className="font-bold text-lg text-foreground font-heading">YouthConnex</span>
          </Link>

          {isDashboard && (
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <Link href="/map" className="text-foreground hover:text-primary text-sm font-medium">
                Map
              </Link>
              <Link href="/dashboard" className="text-foreground hover:text-primary text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/opportunities" className="text-foreground hover:text-primary text-sm font-medium">
                Opportunities
              </Link>
              <Link href="/resources" className="text-foreground hover:text-primary text-sm font-medium">
                Resources
              </Link>
            </div>
          )}

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-foreground">
                    Dashboard
                  </Button>
                </Link>
                <Button size="sm" onClick={handleLogout} className="bg-primary hover:bg-primary/90">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-foreground">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-1">
            {isDashboard && (
              <>
                <Link href="/map" onClick={closeMobile} className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Map
                </Link>
                <Link href="/dashboard" onClick={closeMobile} className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/opportunities" onClick={closeMobile} className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Opportunities
                </Link>
                <Link href="/resources" onClick={closeMobile} className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Resources
                </Link>
                <div className="border-t border-border my-2" />
              </>
            )}
            {user ? (
              <>
                <Link href="/dashboard" onClick={closeMobile} className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={closeMobile} className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link href="/auth/sign-up" onClick={closeMobile}>
                  <Button size="sm" className="w-full mt-2 bg-primary hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
