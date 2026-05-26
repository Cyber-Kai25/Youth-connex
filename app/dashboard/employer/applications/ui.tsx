'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'

type Row = {
  id: string
  status: string
  application_date: string
  updated_at: string
  user_id: string
  opportunity_id: string
  cv_url?: string | null
  opportunities?: {
    id: string
    title: string
    employer_id: string
  }
  applicant?: {
    id: string
    full_name: string | null
    email: string
    location: string | null
  } | null
}

export function ApplicationsReview({ rows }: { rows: Row[] }) {
  const [localRows, setLocalRows] = useState<Row[]>(rows)
  const [savingId, setSavingId] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<string, Row[]>()
    for (const row of localRows) {
      const key = row.opportunities?.title ?? 'Unknown Opportunity'
      map.set(key, [...(map.get(key) ?? []), row])
    }
    return Array.from(map.entries())
  }, [localRows])

  const updateStatus = async (applicationId: string, status: string) => {
    try {
      setSavingId(applicationId)
      const res = await fetch('/api/employer/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error ?? 'Failed to update application')
      }

      setLocalRows(prev => prev.map(r => (r.id === applicationId ? { ...r, status } : r)))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">Applications</h1>
        <p className="text-muted-foreground mt-1">Review and update applications to your opportunities</p>
      </div>

      {localRows.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No applications yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([oppTitle, oppRows]) => (
            <div key={oppTitle} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">{oppTitle}</h2>
                <p className="text-xs text-muted-foreground">{oppRows.length} application(s)</p>
              </div>

              <div className="divide-y divide-border">
                {oppRows.map(row => (
                  <div key={row.id} className="p-3 sm:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground">
                        {row.applicant?.full_name ?? 'Applicant'}
                      </div>
                      <div className="text-sm text-muted-foreground break-all">{row.applicant?.email ?? row.user_id}</div>
                      {row.applicant?.location && (
                        <div className="text-xs text-muted-foreground">📍 {row.applicant.location}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Applied: {new Date(row.application_date).toLocaleDateString()}
                      </div>
                      {row.cv_url && (
                        <a
                          href={row.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-primary hover:underline"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View CV
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {row.status}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={savingId === row.id}
                        onClick={() => updateStatus(row.id, 'reviewed')}
                      >
                        Mark Reviewed
                      </Button>
                      <Button
                        size="sm"
                        disabled={savingId === row.id}
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => updateStatus(row.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={savingId === row.id}
                        onClick={() => updateStatus(row.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
