'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function OpportunityDetailsPage() {
  const params = useParams()
  const opportunityId = params.id as string
  const [opportunity, setOpportunity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [opportunityId])

  async function fetchData() {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Supabase environment variables are not configured')
        setLoading(false)
        return
      }

      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: opp } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', opportunityId)
        .single()

      setOpportunity(opp)

      if (user) {
        const { data: saved } = await supabase
          .from('saved_opportunities')
          .select('id')
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId)
          .maybeSingle()

        setIsSaved(!!saved)

        const { data: applied } = await supabase
          .from('applications')
          .select('id')
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId)
          .maybeSingle()

        setHasApplied(!!applied)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching opportunity:', error)
      setLoading(false)
    }
  }

  async function handleApply() {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        alert('Service not configured')
        return
      }

      const supabase = createClient()

      const { error } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          user_id: user.id,
          status: 'pending',
        })

      if (error) throw error

      setHasApplied(true)
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Error applying:', error)
      alert('Failed to submit application')
    }
  }

  async function handleSave() {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return
      }

      const supabase = createClient()

      if (isSaved) {
        const { error } = await supabase
          .from('saved_opportunities')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId)

        if (error) throw error
        setIsSaved(false)
      } else {
        const { error } = await supabase
          .from('saved_opportunities')
          .insert({
            user_id: user.id,
            opportunity_id: opportunityId,
          })

        if (error) throw error
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar isDashboard={true} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading opportunity details...</p>
        </div>
      </main>
    )
  }

  if (!opportunity) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar isDashboard={true} />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Opportunity Not Found</h1>
          <Link href="/opportunities">
            <Button className="bg-primary hover:bg-primary/90">Back to Opportunities</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar isDashboard={true} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          ← Back to Opportunities
        </Link>

        {/* Hero Image */}
        {opportunity.image_url && (
          <div className="h-48 sm:h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-6 sm:mb-8 overflow-hidden flex items-center justify-center">
            <img
              src={opportunity.image_url}
              alt={opportunity.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            {/* Title and Tags */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  {opportunity.category}
                </span>
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full">
                  {opportunity.duration}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-heading">{opportunity.title}</h1>
              <p className="text-lg text-muted-foreground">By {opportunity.employer_name}</p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 p-4 sm:p-6 bg-card rounded-lg border border-border">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Location</p>
                <p className="font-semibold text-foreground">{opportunity.location}</p>
              </div>
              {opportunity.salary_min && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Salary</p>
                  <p className="font-semibold text-primary">
                    {opportunity.salary_min.toLocaleString()} - {opportunity.salary_max?.toLocaleString()} {opportunity.salary_currency}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Available Spots</p>
                <p className="font-semibold text-foreground">{opportunity.available_spots || 'Multiple'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Posted</p>
                <p className="font-semibold text-foreground">{new Date(opportunity.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">About this Opportunity</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">{opportunity.description}</p>
              </div>
            </div>

            {/* Required Skills */}
            {opportunity.required_skills && opportunity.required_skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.required_skills.map((skill: string, idx: number) => (
                    <span key={idx} className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-24 bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground font-heading">Ready?</h3>
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-lg transition-all ${
                    isSaved
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save for later'}
                >
                  <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              <Button
                onClick={handleApply}
                disabled={hasApplied}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50"
              >
                {hasApplied ? '✓ Applied' : 'Apply Now'}
              </Button>

              <div className="space-y-3 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">ORGANIZATION</p>
                  <p className="font-semibold text-foreground text-sm">{opportunity.employer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">EMPLOYMENT TYPE</p>
                  <p className="font-semibold text-foreground text-sm">{opportunity.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">REGION</p>
                  <p className="font-semibold text-foreground text-sm">{opportunity.region || opportunity.location}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border text-xs text-muted-foreground text-center">
                Need help? <br />
                <Link href="/" className="text-primary hover:underline">Contact Support</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
