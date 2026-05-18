import { createClient } from '@/lib/supabase/server'
import { sampleOpportunities } from '@/lib/seed-data'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if opportunities already exist
    const { count } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
      return NextResponse.json(
        { message: 'Database already seeded' },
        { status: 200 }
      )
    }

    // Create a demo employer account
    const { data: authData } = await supabase.auth.signUp({
      email: 'employer@youthconnex.cm',
      password: 'DemoEmployer@2024',
      options: {
        data: {
          full_name: 'YouthConnex Employer',
          user_type: 'employer',
        },
      },
    })

    const employerId = authData.user?.id || '00000000-0000-0000-0000-000000000000'

    // Add sample opportunities
    const opportunitiesToInsert = sampleOpportunities.map(opp => ({
      ...opp,
      employer_id: employerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('opportunities')
      .insert(opportunitiesToInsert)

    if (error) throw error

    return NextResponse.json(
      {
        message: 'Database seeded successfully',
        opportunitiesCount: opportunitiesToInsert.length,
        employerEmail: 'employer@youthconnex.cm',
        employerPassword: 'DemoEmployer@2024',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
