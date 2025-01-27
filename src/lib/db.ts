import { supabase } from './supabase';
import type { Wine, Ingredient, ProductionVariant } from './supabase';

export const db = {
  wines: {
    findMany: async (userId: string): Promise<Wine[]> => {
      const { data: wines, error } = await supabase
        .from('wines')
        .select(`
          *,
          ingredients (*),
          production_variants (*),
          certifications (*),
          disclaimer_icons (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wines:', error);
        throw error;
      }

      return wines || [];
    },

    findUnique: async (id: string, userId: string): Promise<Wine | null> => {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.error('Invalid UUID format:', id);
        return null;
      }

      const { data: wine, error } = await supabase
        .from('wines')
        .select(`
          *,
          ingredients (*),
          production_variants (*),
          certifications (*),
          disclaimer_icons (*)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching wine:', error);
        return null;
      }

      return wine;
    },

    create: async (data: Omit<Wine, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: wine, error } = await supabase
        .from('wines')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating wine:', error);
        throw error;
      }

      return wine;
    },

    update: async (id: string, userId: string, data: Partial<Wine>) => {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid UUID format');
      }

      const { data: wine, error } = await supabase
        .from('wines')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating wine:', error);
        throw error;
      }

      return wine;
    },

    delete: async (id: string, userId: string): Promise<boolean> => {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid UUID format');
      }

      const { error } = await supabase
        .from('wines')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting wine:', error);
        return false;
      }

      return true;
    },
  },

  ingredients: {
    create: async (wineId: string, ingredients: Omit<Ingredient, 'id' | 'wine_id'>[]) => {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(wineId)) {
        throw new Error('Invalid UUID format');
      }

      const { data, error } = await supabase
        .from('ingredients')
        .insert(
          ingredients.map(ingredient => ({
            ...ingredient,
            wine_id: wineId,
          }))
        )
        .select();

      if (error) {
        console.error('Error creating ingredients:', error);
        throw error;
      }

      return data;
    },

    deleteByWineId: async (wineId: string) => {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(wineId)) {
        throw new Error('Invalid UUID format');
      }

      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('wine_id', wineId);

      if (error) {
        console.error('Error deleting ingredients:', error);
        throw error;
      }
    },
  },

  productionVariants: {
    create: async (wineId: string, variants: Omit<ProductionVariant, 'id' | 'wine_id'>[]) => {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(wineId)) {
        throw new Error('Invalid UUID format');
      }

      const { data, error } = await supabase
        .from('production_variants')
        .insert(
          variants.map(variant => ({
            ...variant,
            wine_id: wineId,
          }))
        )
        .select();

      if (error) {
        console.error('Error creating production variants:', error);
        throw error;
      }

      return data;
    },

    deleteByWineId: async (wineId: string) => {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(wineId)) {
        throw new Error('Invalid UUID format');
      }

      const { error } = await supabase
        .from('production_variants')
        .delete()
        .eq('wine_id', wineId);

      if (error) {
        console.error('Error deleting production variants:', error);
        throw error;
      }
    },
  },
};