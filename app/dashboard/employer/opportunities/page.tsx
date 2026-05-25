import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function EmployerOpportunitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, user_type, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.user_type !== 'employer') {
    redirect('/dashboard')
  }

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <Navbar isDashboard={true} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">Your Opportunities</h1>
            <p className="text-muted-foreground mt-1">Manage the roles you&apos;ve published</p>
          </div>

          <Link href="/dashboard/employer/opportunities/new" className="w-full sm:w-auto">
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Create Opportunity</Button>
          </Link>
        </div>

        {opportunities && opportunities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {opportunities.map((opp: any) => (
              <div key={opp.id} className="bg-card rounded-lg border border-border overflow-hidden">
                {opp.image_url && (
                  <div className="h-32 bg-muted overflow-hidden">
                    <img src={opp.image_url} alt={opp.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground font-heading">{opp.title}</h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {opp.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{opp.description}</p>
                  <div className="text-xs text-muted-foreground mt-3">📍 {opp.location}</div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 mt-4">
                    <Link href={`/opportunities/${opp.id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-sm">
                        View Public Page
                      </Button>
                    </Link>
                    <Link href="/dashboard/employer/applications" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-sm">View Applications</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">You haven&apos;t created any opportunities yet.</p>
            <div className="mt-4">
              <Link href="/dashboard/employer/opportunities/new">
                <Button className="bg-primary hover:bg-primary/90">Create your first opportunity</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
