import { supabase } from '../lib/supabase'

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    console.log('Supabase URL:', supabase.supabaseUrl)
    
    // Test auth
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    console.log('Auth session:', session)
    console.log('Auth error:', authError)
    
    // Test database connection
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    console.log('Database test - Data:', data)
    console.log('Database test - Error:', error)
    
    return { success: !error, error }
  } catch (err) {
    console.error('Supabase connection test failed:', err)
    return { success: false, error: err }
  }
}
