import { supabaseOffers as supabase } from '../src/services/supabase';

export interface School {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_image_url: string | null;
  type: string;
  city: string;
  address: string | null;
  description: string | null;
  website_url: string | null;
  phone: string | null;
  email: string | null;
  programs: string[];
  student_count: number | null;
  is_partner: boolean;
  is_active: boolean;
  created_at: string;
}

export const schoolsService = {
  async getAllSchools(): Promise<School[]> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('is_active', true)
      .order('is_partner', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
    return data || [];
  },

  async getSchoolBySlug(slug: string): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching school:', error);
      throw error;
    }
    return data || null;
  },

  async searchSchools(filters: {
    city?: string;
    type?: string;
    search?: string;
    partnersOnly?: boolean;
  }): Promise<School[]> {
    let query = supabase
      .from('schools')
      .select('*')
      .eq('is_active', true)
      .order('is_partner', { ascending: false })
      .order('name');

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.partnersOnly) {
      query = query.eq('is_partner', true);
    }
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error searching schools:', error);
      throw error;
    }
    return data || [];
  }
};
