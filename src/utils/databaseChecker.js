// Database setup checker
import { supabase } from '../lib/supabase'
import { addPredefinedRecipes } from './predefinedRecipes'

export const checkDatabaseSetup = async () => {
  console.log('🔍 Checking database setup...')
  
  try {
    // Check if profiles table exists
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    console.log('Profiles table check:', { profiles, profilesError })
    
    // Check if recipes table exists
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .limit(1)
    
    console.log('Recipes table check:', { recipes, recipesError })
    
    // Check storage bucket
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    console.log('Storage buckets:', { buckets, bucketsError })
    
    if (profilesError && profilesError.code === 'PGRST116') {
      console.error('❌ Profiles table does not exist! Please run the database schema.')
      return { success: false, error: 'Profiles table missing' }
    }
    
    if (recipesError && recipesError.code === 'PGRST116') {
      console.error('❌ Recipes table does not exist! Please run the database schema.')
      return { success: false, error: 'Recipes table missing' }
    }
    
    console.log('✅ Database setup looks good!')
    
    // Check if we have any recipes, if not, add predefined ones
    const { data: existingRecipes, error: recipesCheckError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1)
    
    if (!recipesCheckError && (!existingRecipes || existingRecipes.length === 0)) {
      console.log('📝 No recipes found, adding predefined recipes...')
      const addRecipesResult = await addPredefinedRecipes()
      console.log('Predefined recipes result:', addRecipesResult)
    }
    
    return { success: true }
    
  } catch (error) {
    console.error('❌ Database setup check failed:', error)
    return { success: false, error }
  }
}
