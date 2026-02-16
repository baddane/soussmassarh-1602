
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { supabaseOffers } from '../src/services/supabase';

const CITIES = [
  'Agadir', 'Inezgane', 'Ait Melloul', 'Taroudant', 'Tiznit',
  'Ouarzazate', 'Sidi Ifni', 'Chtouka Ait Baha', 'Tata'
];

const CONTRACT_TYPES = [
  'CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Intérim'
];

const PublishOffer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emploi_metier: '',
    raison_sociale: user?.details?.companyName || user?.name || '',
    ville: '',
    type_contrat: '',
    nbre_postes: 1,
    full_description: '',
    required_skills: '',
    suggested_salary_range: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) return <Navigate to="/connexion" />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'nbre_postes' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.emploi_metier || !formData.ville || !formData.type_contrat || !formData.full_description) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        emploi_metier: formData.emploi_metier,
        raison_sociale: formData.raison_sociale,
        ville: formData.ville,
        type_contrat: formData.type_contrat,
        nbre_postes: formData.nbre_postes,
        full_description: formData.full_description,
        required_skills: formData.required_skills
          ? formData.required_skills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        suggested_salary_range: formData.suggested_salary_range || null,
        date_offre: new Date().toISOString().split('T')[0],
        ref_offre: `OFF-${Date.now()}`,
      };

      const { error: insertError } = await supabaseOffers
        .from('job_offers')
        .insert([payload]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      console.error('Error publishing offer:', err);
      setError(err.message || 'Une erreur est survenue lors de la publication.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Offre publiée avec succès !</h1>
        <p className="text-gray-500 mb-8">
          Votre offre d'emploi est maintenant visible par tous les candidats de la région Souss-Massa.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/offres"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Voir les offres
          </Link>
          <Link
            to="/dashboard"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Tableau de bord</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Publier une offre</span>
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-2">Publier une offre d'emploi</h1>
      <p className="text-gray-500 mb-10">
        Remplissez les informations ci-dessous pour diffuser votre annonce auprès des talents du Souss-Massa.
      </p>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre du poste */}
        <div>
          <label htmlFor="emploi_metier" className="block text-sm font-bold text-gray-700 mb-2">
            Titre du poste / Métier *
          </label>
          <input
            id="emploi_metier"
            name="emploi_metier"
            type="text"
            value={formData.emploi_metier}
            onChange={handleChange}
            placeholder="Ex: Développeur Full-Stack, Chef de projet marketing..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
            required
          />
        </div>

        {/* Nom de l'entreprise */}
        <div>
          <label htmlFor="raison_sociale" className="block text-sm font-bold text-gray-700 mb-2">
            Nom de l'entreprise *
          </label>
          <input
            id="raison_sociale"
            name="raison_sociale"
            type="text"
            value={formData.raison_sociale}
            onChange={handleChange}
            placeholder="Raison sociale de votre entreprise"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
            required
          />
        </div>

        {/* Ville & Type de contrat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ville" className="block text-sm font-bold text-gray-700 mb-2">
              Ville *
            </label>
            <select
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner une ville</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type_contrat" className="block text-sm font-bold text-gray-700 mb-2">
              Type de contrat *
            </label>
            <select
              id="type_contrat"
              name="type_contrat"
              value={formData.type_contrat}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un type</option>
              {CONTRACT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Nombre de postes & Salaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nbre_postes" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre de postes
            </label>
            <input
              id="nbre_postes"
              name="nbre_postes"
              type="number"
              min={1}
              max={100}
              value={formData.nbre_postes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="suggested_salary_range" className="block text-sm font-bold text-gray-700 mb-2">
              Fourchette salariale (optionnel)
            </label>
            <input
              id="suggested_salary_range"
              name="suggested_salary_range"
              type="text"
              value={formData.suggested_salary_range}
              onChange={handleChange}
              placeholder="Ex: 8 000 - 12 000 MAD/mois"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Compétences requises */}
        <div>
          <label htmlFor="required_skills" className="block text-sm font-bold text-gray-700 mb-2">
            Compétences requises (séparées par des virgules)
          </label>
          <input
            id="required_skills"
            name="required_skills"
            type="text"
            value={formData.required_skills}
            onChange={handleChange}
            placeholder="Ex: React, Node.js, SQL, Gestion de projet"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description complète */}
        <div>
          <label htmlFor="full_description" className="block text-sm font-bold text-gray-700 mb-2">
            Description complète de l'offre *
          </label>
          <textarea
            id="full_description"
            name="full_description"
            value={formData.full_description}
            onChange={handleChange}
            rows={8}
            placeholder="Décrivez le poste, les missions, le profil recherché, les avantages..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            maxLength={5000}
            required
          />
          <p className="text-xs text-gray-400 mt-1">{formData.full_description.length}/5000 caractères</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Publication...' : 'Publier l\'offre'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublishOffer;
