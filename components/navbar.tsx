'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'

export function Navbar({ isDashboard = false }: { isDashboard?: boolean }) {
  const [user, setUser] = useState<Session | null>(null)
  const [mounted, setMounted] = useState(false)
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

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="w-full border-b border-border bg-background sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Y</span>
            </div>
            <span className="font-bold text-lg text-foreground font-heading">YouthConnex</span>
          </Link>

          {isDashboard && (
            <div className="flex items-center gap-4 md:gap-6">
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

          <div className="flex items-center gap-2 md:gap-4">
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
        </div>
      </div>
    </nav>
  )
}
