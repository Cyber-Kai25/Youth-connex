import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: applications } = await supabase
    .from('applications')
    .select('*, opportunities(*)')
    .eq('user_id', user.id)
    .order('application_date', { ascending: false })

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'active')
    .limit(6)
    .order('created_at', { ascending: false })

  const { data: savedOpportunities } = await supabase
    .from('saved_opportunities')
    .select('opportunity_id')
    .eq('user_id', user.id)

  const pendingCount = applications?.filter(a => a.status === 'pending').length || 0
  const approvedCount = applications?.filter(a => a.status === 'accepted').length || 0

  return (
    <main className="min-h-screen bg-background">
      <Navbar isDashboard={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your career journey in {profile?.location || 'Cameroon'}.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="p-6 bg-card rounded-lg border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending Applications</p>
                <p className="text-3xl font-bold text-foreground font-heading mt-2">{String(pendingCount).padStart(2, '0')}</p>
              </div>
              <div className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Active</div>
            </div>
            <div className="w-full h-1 bg-muted rounded-full mt-4">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${(pendingCount / 10) * 100}%` }}></div>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Approved Roles</p>
                <p className="text-3xl font-bold text-primary font-heading mt-2">{String(approvedCount).padStart(2, '0')}</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Great</div>
            </div>
            <div className="w-full h-1 bg-muted rounded-full mt-4">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(approvedCount / 5) * 100}%` }}></div>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Saved Opportunities</p>
                <p className="text-3xl font-bold text-foreground font-heading mt-2">{String(savedOpportunities?.length || 0).padStart(2, '0')}</p>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Archive</div>
            </div>
            <div className="w-full h-1 bg-muted rounded-full mt-4">
              <div className="h-full bg-accent rounded-full" style={{ width: `${((savedOpportunities?.length || 0) / 20) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {profile?.user_type === 'employer' && (
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">Employer Tools</h2>
              <Link href="/dashboard/employer/opportunities/new">
                <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Create Opportunity</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Manage Opportunities</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage opportunities you&apos;ve created.
                </p>
                <Link href="/dashboard/employer/opportunities">
                  <Button variant="outline" className="w-full">Go to Opportunities</Button>
                </Link>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Review Applications</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review applications submitted to your opportunities.
                </p>
                <Link href="/dashboard/employer/applications">
                  <Button variant="outline" className="w-full">Go to Applications</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Opportunities */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">Recommended for You</h2>
            <Link href="/opportunities">
              <Button variant="ghost" className="text-primary hover:bg-primary/10">
                View All →
              </Button>
            </Link>
          </div>

          {opportunities && opportunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {opportunities.map((opp: any) => (
                <div key={opp.id} className="bg-card rounded-lg border border-border hover:border-primary/30 overflow-hidden hover:shadow-lg transition-all">
                  {opp.image_url && (
                    <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                      <img 
                        src={opp.image_url} 
                        alt={opp.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {opp.category}
                        </span>
                        <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                          {opp.duration}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 font-heading text-lg">{opp.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{opp.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">📍 {opp.location}</span>
                      {opp.salary_min && (
                        <span className="font-semibold text-primary">{opp.salary_min.toLocaleString()} - {opp.salary_max?.toLocaleString()} {opp.salary_currency}</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <Link href={`/opportunities/${opp.id}`} className="block">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                          Quick View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground mb-4">No opportunities found yet</p>
              <Link href="/opportunities">
                <Button className="bg-primary hover:bg-primary/90">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Alerts */}
        {applications && applications.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground font-heading mb-6">Recent Alerts</h2>
            <div className="space-y-4">
              {applications.slice(0, 3).map((app: any) => (
                <div key={app.id} className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(app.application_date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground">{app.opportunities?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{app.opportunities?.employer_name}</p>
                    </div>
                    <Link href={`/opportunities/${app.opportunity_id}`}>
                      <Button variant="ghost" size="sm" className="text-primary">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
