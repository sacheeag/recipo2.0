import { supabase } from '../lib/supabase'

export const recipeService = {
  // Get all recipes
  async getRecipes() {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get recipe by ID
  async getRecipeById(id) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Create new recipe
  async createRecipe(recipeData) {
    try {
      // Try to get current user, if not authenticated, use demo user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      let userId;
      if (user) {
        userId = user.id;
        console.log('Creating recipe for authenticated user:', userId);
      } else {
        // Use demo user ID if not authenticated
        userId = '00000000-0000-0000-0000-000000000001';
        console.log('Creating recipe for demo user:', userId);
      }

      const recipeToInsert = {
        ...recipeData,
        user_id: userId
      };

      console.log('Recipe data to insert:', recipeToInsert);

      const { data, error } = await supabase
        .from('recipes')
        .insert([recipeToInsert])
        .select()
        .single()
      
      if (error) {
        console.error('Recipe creation error:', error);
        return { data: null, error };
      }

      console.log('Recipe created successfully:', data);
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error in createRecipe:', err);
      return { data: null, error: err };
    }
  },

  // Update recipe
  async updateRecipe(id, recipeData) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('recipes')
      .update(recipeData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own recipes
      .select()
      .single()
    
    return { data, error }
  },

  // Delete recipe
  async deleteRecipe(id) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only delete their own recipes
    
    return { data: null, error }
  },

  // Get user's recipes
  async getUserRecipes(userId) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Upload recipe image
  async uploadRecipeImage(file, recipeId) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${recipeId}-${Date.now()}.${fileExt}`
    const filePath = `recipe-images/${fileName}`

    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file)

    if (error) {
      return { data: null, error }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath)

    return { data: { url: publicUrl }, error: null }
  }
}
