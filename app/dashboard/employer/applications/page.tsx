import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'
import { ApplicationsReview } from './ui'

export default async function EmployerApplicationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, user_type')
    .eq('id', user.id)
    .single()

  if (!profile || profile.user_type !== 'employer') {
    redirect('/dashboard')
  }

  const { data: applications } = await supabase
    .from('applications')
    .select(
      'id, status, application_date, updated_at, user_id, opportunity_id, cv_url, opportunities!inner(id, title, employer_id)'
    )
    .eq('opportunities.employer_id', user.id)
    .order('application_date', { ascending: false })

  const applicantIds = Array.from(new Set((applications ?? []).map((a: any) => a.user_id)))

  const { data: applicants } = applicantIds.length
    ? await supabase
        .from('profiles')
        .select('id, full_name, email, location')
        .in('id', applicantIds)
    : { data: [] as any[] }

  const applicantsById = new Map<string, any>((applicants ?? []).map((p: any) => [p.id, p]))

  const rows = (applications ?? []).map((a: any) => ({
    ...a,
    applicant: applicantsById.get(a.user_id) ?? null,
  }))

  return (
    <main className="min-h-screen bg-background">
      <Navbar isDashboard={true} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <ApplicationsReview rows={rows} />
      </div>
    </main>
  )
}
