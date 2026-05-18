import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_type')
      .eq('id', user.id)
      .single()

    if (!profile || profile.user_type !== 'employer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const applicationId = String(body.applicationId ?? '')
    const status = String(body.status ?? '')

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { data: appRow, error: appErr } = await supabase
      .from('applications')
      .select('id, opportunity_id')
      .eq('id', applicationId)
      .single()

    if (appErr || !appRow) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const { data: oppRow, error: oppErr } = await supabase
      .from('opportunities')
      .select('id, employer_id')
      .eq('id', appRow.opportunity_id)
      .single()

    if (oppErr || !oppRow) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
    }

    if (oppRow.employer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ application: data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 },
    )
  }
}
