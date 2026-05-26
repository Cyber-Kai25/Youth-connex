import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('cv') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and Word documents are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate a unique file path per user
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const filePath = `${user.id}/cv.${fileExt}`

    // Delete any existing CV first
    await supabase.storage.from('cvs').remove([`${user.id}/cv.pdf`, `${user.id}/cv.doc`, `${user.id}/cv.docx`])

    // Upload the new file
    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 })
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(filePath)
    const cvUrl = urlData.publicUrl

    // Update the user's profile with the CV URL
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ cv_url: cvUrl })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      return NextResponse.json({ error: 'File uploaded but failed to update profile.' }, { status: 500 })
    }

    return NextResponse.json({ cv_url: cvUrl, file_name: file.name }, { status: 200 })
  } catch (error) {
    console.error('CV upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remove all possible CV files for this user
    await supabase.storage.from('cvs').remove([`${user.id}/cv.pdf`, `${user.id}/cv.doc`, `${user.id}/cv.docx`])

    // Clear the CV URL from profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ cv_url: null })
      .eq('id', user.id)

    if (profileError) {
      return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}
