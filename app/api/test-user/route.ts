import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const email = 'testuser@example.com'
    const password = 'TestUser123!@#'

    console.log('[v0] Creating test youth user with email:', email)

    // Sign up a new test user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Test Youth User',
          user_type: 'youth'
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
    })

    if (signUpError) {
      console.error('[v0] Sign up error:', signUpError)
      // If user already exists, that's ok - we'll just return the credentials
      if (signUpError.message?.includes('already registered')) {
        return NextResponse.json({
          success: true,
          message: 'Test user already exists',
          credentials: {
            email,
            password,
            type: 'youth',
            note: 'User already exists in the system'
          }
        })
      }
      return NextResponse.json({
        success: false,
        error: signUpError.message || 'Failed to create test user'
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        error: 'User creation returned no user data'
      }, { status: 400 })
    }

    console.log('[v0] Test user created successfully:', authData.user.id)

    return NextResponse.json({
      success: true,
      message: 'Test youth user created successfully',
      credentials: {
        email,
        password,
        type: 'youth',
        note: 'Email confirmation may be required - check your inbox or use the password directly to login'
      }
    })
  } catch (error) {
    console.error('[v0] Test user creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    instructions: 'POST to this endpoint to create a test user',
    testCredentials: {
      email: 'testuser@youthconnex.cm',
      password: 'TestUser123!@#',
      type: 'youth'
    }
  })
}
