'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

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

const DURATIONS = ['Full-time', 'Part-time', 'Contract', '12 Months', 'Hybrid']

export function NewOpportunityForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [location, setLocation] = useState('')
  const [region, setRegion] = useState(REGIONS[0])
  const [salaryMin, setSalaryMin] = useState<string>('')
  const [salaryMax, setSalaryMax] = useState<string>('')
  const [salaryCurrency, setSalaryCurrency] = useState('CFA')
  const [duration, setDuration] = useState(DURATIONS[0])
  const [capacity, setCapacity] = useState<string>('')
  const [availableSpots, setAvailableSpots] = useState<string>('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const canSubmit = useMemo(() => {
    return Boolean(title.trim() && description.trim() && location.trim() && category)
  }, [title, description, location, category])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    try {
      setIsSubmitting(true)
      setError(null)

      const res = await fetch('/api/employer/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          region,
          salary_min: salaryMin,
          salary_max: salaryMax,
          salary_currency: salaryCurrency,
          duration,
          capacity,
          available_spots: availableSpots,
          required_skills: requiredSkills,
          image_url: imageUrl,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error ?? 'Failed to create opportunity')
        return
      }

      router.push('/dashboard/employer/opportunities')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">Create Opportunity</h1>
        <p className="text-muted-foreground mt-1">Publish a new opportunity for job seekers</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
            placeholder="Opportunity title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm min-h-32"
            placeholder="Describe the role, requirements, benefits..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
            placeholder="City, Region"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Salary Min</label>
            <input
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
              inputMode="numeric"
              placeholder="e.g. 250000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Salary Max</label>
            <input
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
              inputMode="numeric"
              placeholder="e.g. 450000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Currency</label>
            <input
              value={salaryCurrency}
              onChange={(e) => setSalaryCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
              placeholder="CFA"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Capacity</label>
            <input
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
              inputMode="numeric"
              placeholder="e.g. 50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Available Spots</label>
            <input
              value={availableSpots}
              onChange={(e) => setAvailableSpots(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
              inputMode="numeric"
              placeholder="defaults to capacity"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Required Skills (comma separated)</label>
          <input
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
            placeholder="e.g. Project Coordination, Supply Chain"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-input text-foreground text-sm"
            placeholder="https://..."
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? 'Creating...' : 'Create Opportunity'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/employer/opportunities')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
