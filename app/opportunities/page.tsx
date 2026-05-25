'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', 'Agriculture', 'Tech', 'Training', 'Local Jobs', 'Construction', 'Healthcare', 'Services']

  useEffect(() => {
    fetchOpportunities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [selectedCategory, searchTerm, opportunities])

  async function fetchOpportunities() {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Supabase environment variables are not configured')
        setOpportunities([])
        setLoading(false)
        return
      }

      const supabase = createClient()

      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      const { data } = await query

      setOpportunities(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      setLoading(false)
    }
  }

  function applyFilters() {
    let result = opportunities

    if (selectedCategory !== 'All') {
      result = result.filter(opp => opp.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(opp =>
        opp.title.toLowerCase().includes(term) ||
        opp.description.toLowerCase().includes(term) ||
        opp.location.toLowerCase().includes(term)
      )
    }

    setFiltered(result)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar isDashboard={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">Explore Opportunities</h1>
          <p className="text-muted-foreground mt-2">Find roles near you across various sectors</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <svg className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {opportunities.length} opportunities
          </p>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(opp => (
              <div
                key={opp.id}
                className="bg-card rounded-lg border border-border hover:border-primary/30 overflow-hidden hover:shadow-lg transition-all group"
              >
                {opp.image_url && (
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                    <img 
                      src={opp.image_url} 
                      alt={opp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {opp.category}
                    </span>
                    <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                      {opp.duration}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 font-heading text-lg line-clamp-2">{opp.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{opp.description}</p>
                  
                  <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{opp.location}</span>
                    </div>
                    {opp.salary_min && (
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-semibold text-primary">{opp.salary_min.toLocaleString()} - {opp.salary_max?.toLocaleString()} {opp.salary_currency}</span>
                      </div>
                    )}
                    {opp.available_spots !== null && (
                      <div className="flex items-center gap-2">
                        <span>👥</span>
                        <span>{opp.available_spots} spot{opp.available_spots !== 1 ? 's' : ''} available</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/opportunities/${opp.id}`} className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground mb-4">No opportunities found matching your search</p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
