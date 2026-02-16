import { supabaseOffers as supabase } from '../src/services/supabase';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  author_name: string;
  author_avatar_url: string | null;
  read_time_minutes: number;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  published_at: string;
  created_at: string;
}

export const articlesService = {
  async getAllArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
    return data || [];
  },

  async getFeaturedArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }
    return data || [];
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching article:', error);
      throw error;
    }

    // Increment view count
    if (data) {
      supabase
        .from('articles')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id)
        .then(() => {});
    }

    return data || null;
  },

  async searchArticles(filters: {
    category?: string;
    search?: string;
  }): Promise<Article[]> {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
    return data || [];
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('category')
      .eq('is_published', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    const unique = [...new Set((data || []).map((a: any) => a.category))];
    return unique;
  }
};
