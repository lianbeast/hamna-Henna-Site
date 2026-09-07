import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bgumculhgondzufsvpwt.supabase.co'
const supabaseAnonKey = 'sb_publishable_D86X2OPnhC7TUTdKncRAhw_69KlaXZm'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getBusinessProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return {
      business_name: 'Plain-Jane Template',
      contact_email: 'hello@example.com',
      instagram_handle: '@yourhandle',
      tagline: 'A short tagline goes here.'
    }
  }
  return data
}
