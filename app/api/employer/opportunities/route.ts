import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, user_type')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
    }

    if (!profile || profile.user_type !== 'employer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const payload = {
      title: String(body.title ?? '').trim(),
      description: String(body.description ?? '').trim(),
      category: String(body.category ?? '').trim(),
      location: String(body.location ?? '').trim(),
      region: body.region ? String(body.region).trim() : null,
      salary_min: body.salary_min === '' || body.salary_min == null ? null : Number(body.salary_min),
      salary_max: body.salary_max === '' || body.salary_max == null ? null : Number(body.salary_max),
      salary_currency: body.salary_currency ? String(body.salary_currency).trim() : 'CFA',
      duration: body.duration ? String(body.duration).trim() : null,
      capacity: body.capacity === '' || body.capacity == null ? null : Number(body.capacity),
      available_spots:
        body.available_spots === '' || body.available_spots == null
          ? body.capacity === '' || body.capacity == null
            ? null
            : Number(body.capacity)
          : Number(body.available_spots),
      required_skills: Array.isArray(body.required_skills)
        ? body.required_skills
            .map((s: unknown) => String(s).trim())
            .filter((s: string) => Boolean(s))
        : typeof body.required_skills === 'string'
          ? body.required_skills
              .split(',')
              .map((s: string) => s.trim())
              .filter((s: string) => Boolean(s))
          : null,
      image_url: body.image_url ? String(body.image_url).trim() : null,
      employer_id: user.id,
      employer_name: String(profile.full_name ?? 'Employer'),
      status: 'active' as const,
    }

    if (!payload.title || !payload.description || !payload.category || !payload.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase.from('opportunities').insert(payload).select('*').single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ opportunity: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 },
    )
  }
}
