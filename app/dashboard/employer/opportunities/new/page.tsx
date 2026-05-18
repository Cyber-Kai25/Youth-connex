import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'
import { NewOpportunityForm } from './ui'

export default async function NewEmployerOpportunityPage() {
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

  return (
    <main className="min-h-screen bg-background">
      <Navbar isDashboard={true} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NewOpportunityForm />
      </div>
    </main>
  )
}
