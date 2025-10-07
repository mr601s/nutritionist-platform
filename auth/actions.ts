'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  
  // Sign up with email confirmation
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  })
  
  if (error) {
    return { error: error.message }
  }
  
  // Create customer profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: 'customer',
      })
    
    if (profileError) {
      return { error: profileError.message }
    }
  }
  
  return { success: true, message: 'Check your email to confirm your account!' }
}

export async function signUpAdmin(formData: FormData, inviteToken: string) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  
  // Verify invite token
  const { data: invite, error: inviteError } = await supabase
    .from('admin_invites')
    .select('*')
    .eq('token', inviteToken)
    .eq('email', email)
    .single()
  
  if (inviteError || !invite || invite.used) {
    return { error: 'Invalid or expired invite link' }
  }
  
  // Sign up with email confirmation
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        role: 'admin',
      },
    },
  })
  
  if (error) {
    return { error: error.message }
  }
  
  // Create admin profile and mark invite as used
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: 'admin',
      })
    
    if (profileError) {
      return { error: profileError.message }
    }
    
    // Mark invite as used
    await supabase
      .from('admin_invites')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('token', inviteToken)
  }
  
  return { success: true, message: 'Check your email to confirm your admin account!' }
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function sendAdminInvite(email: string) {
  const supabase = await createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    return { error: 'Only admins can send invites' }
  }
  
  // Generate invite token
  const token = crypto.randomUUID()
  
  // Create invite record
  const { error } = await supabase
    .from('admin_invites')
    .insert({
      email,
      token,
      invited_by: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
  
  if (error) {
    return { error: error.message }
  }
  
  // Send invite email via Supabase
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/admin-signup?token=${token}&email=${encodeURIComponent(email)}`
  
  // Use Supabase's email service to send the invite
  const { error: emailError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: inviteUrl,
  })
  
  // Note: You may want to use a custom email template in Supabase for admin invites
  // This is a workaround using the password reset email
  
  return { success: true, inviteUrl }
}
