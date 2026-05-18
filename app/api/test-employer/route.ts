import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const email = 'employer@example.com'
    const password = 'Employer123!@#'

    console.log('[v0] Creating test employer user with email:', email)

    // Sign up a new test employer
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Test Employer Organization',
          user_type: 'employer'
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
    })

    if (signUpError) {
      console.error('[v0] Sign up error:', signUpError)
      // If user already exists, that's ok
      if (signUpError.message?.includes('already registered')) {
        return NextResponse.json({
          success: true,
          message: 'Test employer already exists',
          credentials: {
            email,
            password,
            type: 'employer',
            note: 'User already exists in the system'
          }
        })
      }
      return NextResponse.json({
        success: false,
        error: signUpError.message || 'Failed to create test employer'
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        error: 'User creation returned no user data'
      }, { status: 400 })
    }

    console.log('[v0] Test employer created successfully:', authData.user.id)

    return NextResponse.json({
      success: true,
      message: 'Test employer user created successfully',
      credentials: {
        email,
        password,
        type: 'employer',
        note: 'Email confirmation may be required - check your inbox or use the password directly to login'
      }
    })
  } catch (error) {
    console.error('[v0] Test employer creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    instructions: 'POST to this endpoint to create a test employer user',
    testCredentials: {
      email: 'employer@youthconnex.cm',
      password: 'Employer123!@#',
      type: 'employer'
    }
  })
}
