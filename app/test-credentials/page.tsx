'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'

interface Credentials {
  email: string
  password: string
  type: string
  note?: string
}

export default function TestCredentialsPage() {
  const [youthCredentials, setYouthCredentials] = useState<Credentials | null>(null)
  const [employerCredentials, setEmployerCredentials] = useState<Credentials | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createYouthUser = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/test-user', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setYouthCredentials(data.credentials)
      } else {
        setError(data.error || 'Failed to create youth user')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createEmployerUser = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/test-employer', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setEmployerCredentials(data.credentials)
      } else {
        setError(data.error || 'Failed to create employer user')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isDashboard={true} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Test Credentials</h1>
          <p className="text-muted-foreground">Create test user accounts to explore YouthConnex features</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Youth User Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Youth User</h2>
            <p className="text-muted-foreground mb-6">
              Explore opportunities, apply for positions, save jobs, and access resources.
            </p>

            {youthCredentials ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                  <div className="mb-2">
                    <span className="text-muted-foreground">Email:</span>
                    <p className="text-foreground font-semibold">{youthCredentials.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Password:</span>
                    <p className="text-foreground font-semibold">{youthCredentials.password}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {youthCredentials.note}
                </p>
                <Link href="/auth/login">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Login as Youth User
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={createYouthUser}
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                {loading ? 'Creating...' : 'Create Youth User'}
              </Button>
            )}
          </Card>

          {/* Employer User Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Employer User</h2>
            <p className="text-muted-foreground mb-6">
              Post opportunities, manage applications, and connect with talented youth.
            </p>

            {employerCredentials ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                  <div className="mb-2">
                    <span className="text-muted-foreground">Email:</span>
                    <p className="text-foreground font-semibold">{employerCredentials.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Password:</span>
                    <p className="text-foreground font-semibold">{employerCredentials.password}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {employerCredentials.note}
                </p>
                <Link href="/auth/login">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Login as Employer
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={createEmployerUser}
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                {loading ? 'Creating...' : 'Create Employer User'}
              </Button>
            )}
          </Card>
        </div>

        {/* Features to Test */}
        <Card className="p-6 bg-muted/50">
          <h3 className="text-xl font-bold text-foreground mb-4">What You Can Test</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Youth Features</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Browse opportunities on the map</li>
                <li>Filter by sector and region</li>
                <li>Apply for positions</li>
                <li>Save opportunities for later</li>
                <li>View dashboard with stats</li>
                <li>Access resources and guides</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Employer Features</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Post new opportunities</li>
                <li>Manage job postings</li>
                <li>View applications</li>
                <li>Access dashboard</li>
                <li>See posted jobs on map</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
