import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://atzybuvffuflfcruonkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0enlidXZmZnVmbGZjcnVvbmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTgyMzgsImV4cCI6MjA3Njg5NDIzOH0.1qOEql4lTnCUosHTlncG1cyFpxqzY4QG6IYGEEfKJ_g'

export const supabase = createClient(supabaseUrl, supabaseKey)
