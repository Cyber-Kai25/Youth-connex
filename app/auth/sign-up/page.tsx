'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** Strip HTML tags and SQL-sensitive characters from a string */
function sanitize(value: string): string {
  return value
    .replace(/[<>'"`;\\]/g, '')
    .trim()
}

/** Basic email format check */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Password strength rules */
function getPasswordErrors(pw: string): string[] {
  const errors: string[] = []
  if (pw.length < 8) errors.push('At least 8 characters')
  if (!/[A-Z]/.test(pw)) errors.push('One uppercase letter')
  if (!/[a-z]/.test(pw)) errors.push('One lowercase letter')
  if (!/[0-9]/.test(pw)) errors.push('One number')
  return errors
}

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState('youth')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const passwordErrors = password.length > 0 ? getPasswordErrors(password) : []

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const cleanName = sanitize(fullName)
    const cleanEmail = sanitize(email).toLowerCase()

    if (cleanName.length < 2) {
      setError('Please enter your full name (at least 2 characters).')
      setIsLoading(false)
      return
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.')
      setIsLoading(false)
      return
    }

    const pwErrors = getPasswordErrors(password)
    if (pwErrors.length > 0) {
      setError(`Password must contain: ${pwErrors.join(', ').toLowerCase()}.`)
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            full_name: cleanName,
            user_type: userType,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-primary font-heading">YouthConnex</h1>
            <p className="text-sm text-muted-foreground mt-1">Join Cameroon&apos;s Youth Employment Network</p>
          </div>
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Register to access opportunities, training, and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="Your full name"
                      required
                      maxLength={100}
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-input text-foreground"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      maxLength={254}
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-input text-foreground"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        maxLength={128}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-input text-foreground pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 013.168-4.477M6.343 6.343A9.972 9.972 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.168 4.477M6.343 6.343L3 3m3.343 3.343l2.829 2.829m4.486 4.486l2.829 2.829M6.343 6.343l11.314 11.314M14.121 14.121A3 3 0 009.879 9.879" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {password.length > 0 && (
                      <div className="space-y-1 mt-1">
                        {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map((rule) => {
                          const passed = !passwordErrors.includes(rule)
                          return (
                            <div key={rule} className="flex items-center gap-1.5 text-xs">
                              {passed ? (
                                <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                </svg>
                              )}
                              <span className={passed ? 'text-green-600' : 'text-muted-foreground'}>{rule}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="usertype">I am a:</Label>
                    <select
                      id="usertype"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="youth">Youth/Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    disabled={isLoading || passwordErrors.length > 0}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-primary underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
