import { createClient } from '@supabase/supabase-js';

// Configuration pour la base de données d'offres d'emploi externe
// IMPORTANT: Set these in .env.local — never hardcode credentials in source code
const offersSupabaseUrl = (import.meta as any).env.VITE_SUPABASE_OFFERS_URL || '';
const offersSupabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_OFFERS_ANON_KEY || '';

// Configuration pour la base de données du site actuel (authentification et données utilisateur)
const siteSupabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const siteSupabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Vérification que les variables d'environnement du site sont définies
if (!siteSupabaseUrl || !siteSupabaseAnonKey) {
  console.warn('⚠️  Variables d\'environnement du site non définies. Assurez-vous d\'avoir un .env.local avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY');
}

// Clients Supabase — ne créer que si les variables sont définies
export const supabaseOffers = offersSupabaseUrl && offersSupabaseAnonKey
  ? createClient(offersSupabaseUrl, offersSupabaseAnonKey)
  : null;
export const supabaseSite = siteSupabaseUrl && siteSupabaseAnonKey
  ? createClient(siteSupabaseUrl, siteSupabaseAnonKey)
  : null;

// Export par défaut - UTILISER TOUJOURS supabaseSite pour l'authentification et les données utilisateur
// supabaseOffers est uniquement pour les offres d'emploi
export const supabase = supabaseSite;

// URL du client Supabase pour les fonctions Edge
export const supabaseUrl = siteSupabaseUrl;

// Fonction utilitaire pour vérifier la configuration
export const checkSupabaseConfig = () => {
  console.log('📋 Configuration Supabase :');
  console.log('🔗 Offers DB URL:', offersSupabaseUrl);
  console.log('🔗 Site DB URL:', siteSupabaseUrl || 'Non configuré');
  console.log('🔑 Offers Key:', offersSupabaseAnonKey ? 'Configurée' : 'Non configurée');
  console.log('🔑 Site Key:', siteSupabaseAnonKey ? 'Configurée' : 'Non configurée');
  
  if (!siteSupabaseUrl || !siteSupabaseAnonKey) {
    console.warn('⚠️  Base de données du site non configurée - certaines fonctionnalités peuvent être limitées');
  }
};
