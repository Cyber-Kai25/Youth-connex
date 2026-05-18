'use client'

import { useState, useEffect, Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'

// Dynamically import the map component to avoid SSR issues with Leaflet
const OpportunityMap = dynamic(() => import('@/components/opportunity-map').then(mod => ({ default: mod.OpportunityMap })), {
  loading: () => <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">Loading map...</div>,
  ssr: false,
})

const CATEGORIES = ['Agriculture', 'Tech', 'Training', 'Local Jobs', 'Construction', 'Healthcare', 'Services']
const REGIONS = [
  'Adamawa',
  'Centre',
  'East',
  'Far North',
  'Littoral',
  'North',
  'North-West',
  'South',
  'South-West',
  'West',
]

interface Opportunity {
  id: string
  title: string
  category: string
  location: string
  region: string
  salary_min?: number
  salary_max?: number
}

export default function MapPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        setLoading(true)
        setError(null)

        // Check if Supabase is available
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log('[v0] Supabase not configured, using demo data')
          // Use demo data if Supabase is not available
          setOpportunities(getDemoOpportunities())
          setLoading(false)
          return
        }

        const supabase = createClient()
        const { data, error: supabaseError } = await supabase
          .from('opportunities')
          .select('id, title, category, location, region, salary_min, salary_max')
          .eq('status', 'active')

        if (supabaseError) {
          console.error('[v0] Supabase error:', supabaseError)
          setOpportunities(getDemoOpportunities())
          return
        }

        setOpportunities(data || getDemoOpportunities())
      } catch (err) {
        console.error('[v0] Error fetching opportunities:', err)
        setOpportunities(getDemoOpportunities())
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  const handleMarkerClick = (opportunity: Opportunity) => {
    console.log('[v0] Marker clicked:', opportunity)
  }

  const filteredCount = opportunities.filter(opp => {
    const matchesCategory = !selectedCategory || opp.category === selectedCategory
    const matchesRegion = !selectedRegion || opp.region === selectedRegion
    return matchesCategory && matchesRegion
  }).length

  return (
    <div className="min-h-screen bg-background">
      <Navbar isDashboard={false} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6 -3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 17.618V6.382a1 1 0 00-1.447-.894L15 8m0 13V8m0 0L9 5" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-foreground">Opportunity Map</h1>
            </div>
            <p className="text-muted-foreground">Find roles near you across Cameroon</p>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Sector</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >
                  All Sectors
                </Button>
                {CATEGORIES.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Location</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedRegion === null ? 'default' : 'outline'}
                  onClick={() => setSelectedRegion(null)}
                  className="rounded-full"
                >
                  All Regions
                </Button>
                {REGIONS.map(region => (
                  <Button
                    key={region}
                    variant={selectedRegion === region ? 'default' : 'outline'}
                    onClick={() => setSelectedRegion(region)}
                    className="rounded-full text-sm"
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredCount} result{filteredCount !== 1 ? 's' : ''} found
            </p>
            <Link href="/opportunities">
              <Button variant="outline">
                View as List →
              </Button>
            </Link>
          </div>

          {/* Map */}
          {loading ? (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            </div>
          ) : (
            <OpportunityMap
              opportunities={opportunities}
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onMarkerClick={handleMarkerClick}
            />
          )}

          {/* Legend */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map(category => {
                const categoryColors: Record<string, string> = {
                  'Agriculture': 'bg-[#2D7A4E]',
                  'Tech': 'bg-[#1E40AF]',
                  'Training': 'bg-[#DC2626]',
                  'Local Jobs': 'bg-[#7C3AED]',
                  'Construction': 'bg-[#EA580C]',
                  'Healthcare': 'bg-[#0891B2]',
                  'Services': 'bg-[#6B21A8]',
                }

                return (
                  <div key={category} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${categoryColors[category] || 'bg-gray-400'}`}></div>
                    <span className="text-sm text-foreground">{category}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Demo data for when Supabase is not available
function getDemoOpportunities(): Opportunity[] {
  return [
    {
      id: '1',
      title: 'Commercial Farming Project',
      category: 'Agriculture',
      location: 'Bafoussam, West',
      region: 'West',
      salary_min: 250,
      salary_max: 350,
    },
    {
      id: '2',
      title: 'Sustainable Farm Manager',
      category: 'Agriculture',
      location: 'Bamenda, North-West',
      region: 'North-West',
      salary_min: 300,
      salary_max: 400,
    },
    {
      id: '3',
      title: 'Junior Frontend Developer',
      category: 'Tech',
      location: 'Yaoundé, Centre',
      region: 'Centre',
      salary_min: 400,
      salary_max: 600,
    },
    {
      id: '4',
      title: 'Software Engineering Technician',
      category: 'Tech',
      location: 'Douala, Littoral',
      region: 'Littoral',
      salary_min: 450,
      salary_max: 700,
    },
    {
      id: '5',
      title: 'Welding Training Program',
      category: 'Training',
      location: 'Garoua, North',
      region: 'North',
      salary_min: 150,
      salary_max: 250,
    },
    {
      id: '6',
      title: 'Retail Manager',
      category: 'Local Jobs',
      location: 'Nkongsamba, Littoral',
      region: 'Littoral',
      salary_min: 200,
      salary_max: 350,
    },
    {
      id: '7',
      title: 'Construction Site Manager',
      category: 'Construction',
      location: 'Douala, Littoral',
      region: 'Littoral',
      salary_min: 350,
      salary_max: 550,
    },
    {
      id: '8',
      title: 'Healthcare Worker',
      category: 'Healthcare',
      location: 'Yaoundé, Centre',
      region: 'Centre',
      salary_min: 200,
      salary_max: 300,
    },
  ]
}
