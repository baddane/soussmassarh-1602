import { supabaseOffers as supabase } from '../src/services/supabase';

export interface Company {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_image_url: string | null;
  sector: string;
  city: string;
  address: string | null;
  description: string | null;
  website_url: string | null;
  phone: string | null;
  email: string | null;
  company_size: string | null;
  founded_year: number | null;
  linkedin_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  active_offers_count: number;
  total_hires: number;
  created_at: string;
}

export const companiesService = {
  async getAllCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_active', true)
      .order('is_verified', { ascending: false })
      .order('active_offers_count', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
    return data || [];
  },

  async getCompanyBySlug(slug: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching company:', error);
      throw error;
    }
    return data || null;
  },

  async searchCompanies(filters: {
    city?: string;
    sector?: string;
    search?: string;
  }): Promise<Company[]> {
    let query = supabase
      .from('companies')
      .select('*')
      .eq('is_active', true)
      .order('is_verified', { ascending: false })
      .order('active_offers_count', { ascending: false });

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters.sector) {
      query = query.ilike('sector', `%${filters.sector}%`);
    }
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sector.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
    return data || [];
  },

  async getCompaniesStats() {
    const { count: totalCompanies } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { data: sectorStats } = await supabase
      .from('companies')
      .select('sector')
      .eq('is_active', true);

    const sectors = (sectorStats || []).reduce((acc: Record<string, number>, c: any) => {
      acc[c.sector] = (acc[c.sector] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCompanies: totalCompanies || 0,
      sectors,
    };
  }
};
