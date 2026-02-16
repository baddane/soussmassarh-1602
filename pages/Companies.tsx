
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companiesService, Company } from '../services/companiesService';

const SECTORS = [
  'Informatique',
  'Commerce & Distribution',
  'Santé',
  'Marketing & Communication',
  'Industrie & Production',
  'Hôtellerie & Tourisme',
  'Juridique & Conseil',
  'Agriculture & Agroalimentaire',
  'Banque & Finance',
];

const CITIES = ['Agadir', 'Marrakech', 'Essaouira', 'Taroudant', 'Inezgane'];

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const hasFilters = search || selectedCity || selectedSector;

        if (hasFilters) {
          const data = await companiesService.searchCompanies({
            city: selectedCity || undefined,
            sector: selectedSector || undefined,
            search: search || undefined,
          });
          setCompanies(data);
        } else {
          const data = await companiesService.getAllCompanies();
          setCompanies(data);
        }
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [search, selectedCity, selectedSector]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">Entreprises du Souss-Massa</h1>
        <p className="text-gray-500 mt-2">
          Découvrez les entreprises qui recrutent dans la région et postulez directement à leurs offres.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtres */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Filtrer</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom d'entreprise..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les villes</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secteur</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les secteurs</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">Vous êtes une entreprise ?</h3>
            <p className="text-blue-800 text-sm mb-4">
              Inscrivez-vous gratuitement pour publier vos offres et accéder à notre CVthèque.
            </p>
            <Link
              to="/inscription"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              S'inscrire en tant qu'entreprise
            </Link>
          </div>
        </aside>

        {/* Liste des entreprises */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {companies.length} entreprise{companies.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-gray-500 text-lg">Aucune entreprise trouvée</h3>
              <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="w-14 h-14 rounded-xl object-cover" />
                      ) : (
                        company.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                          {company.name}
                        </h3>
                        {company.is_verified && (
                          <span className="text-blue-500 flex-shrink-0" title="Entreprise vérifiée">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{company.sector}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {company.description || 'Aucune description disponible.'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      {company.city}
                    </span>
                    {company.company_size && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        {company.company_size}
                      </span>
                    )}
                    {company.active_offers_count > 0 && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                        {company.active_offers_count} offre{company.active_offers_count > 1 ? 's' : ''} active{company.active_offers_count > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {company.website_url ? (
                      <a
                        href={company.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Visiter le site
                      </a>
                    ) : (
                      <span />
                    )}
                    <Link
                      to={`/offres?q=${encodeURIComponent(company.name)}`}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                      Voir les offres
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Companies;
