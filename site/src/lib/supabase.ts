import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://bgumculhgondzufsvpwt.supabase.co'
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || 'sb_publishable_D86X2OPnhC7TUTdKncRAhw_69KlaXZm'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getBusinessProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()

  const defaults = {
    business_name: 'Plain-Jane Template',
    contact_email: 'hello@example.com',
    instagram_handle: '@yourhandle',
    tagline: 'A short tagline goes here.'
  };

  if (error || !data) {
    console.error('Error or no profile found, using defaults:', error);
    return defaults;
  }

  return { ...defaults, ...data };
}
