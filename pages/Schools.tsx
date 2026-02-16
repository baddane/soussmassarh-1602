
import React, { useState, useEffect } from 'react';
import { schoolsService, School } from '../services/schoolsService';

const SCHOOL_TYPES = [
  'Université',
  "École d'ingénieur",
  'École de commerce',
  'Institut',
  'Centre de formation',
];

const CITIES = ['Agadir', 'Marrakech', 'Essaouira', 'Taroudant', 'Inezgane'];

const Schools: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [partnersOnly, setPartnersOnly] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const hasFilters = search || selectedCity || selectedType || partnersOnly;

        if (hasFilters) {
          const data = await schoolsService.searchSchools({
            city: selectedCity || undefined,
            type: selectedType || undefined,
            search: search || undefined,
            partnersOnly: partnersOnly || undefined,
          });
          setSchools(data);
        } else {
          const data = await schoolsService.getAllSchools();
          setSchools(data);
        }
      } catch (error) {
        console.error('Error loading schools:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, selectedCity, selectedType, partnersOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">Écoles & Universités partenaires</h1>
        <p className="text-gray-500 mt-2">
          Les établissements d'enseignement de la région Souss-Massa qui préparent les talents de demain.
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
                placeholder="Nom d'école..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Type d'établissement</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                {SCHOOL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={partnersOnly}
                onChange={(e) => setPartnersOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Partenaires uniquement</span>
            </label>
          </div>
        </aside>

        {/* Liste */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {schools.length} établissement{schools.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : schools.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-gray-500 text-lg">Aucun établissement trouvé</h3>
              <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {school.logo_url ? (
                          <img src={school.logo_url} alt={school.name} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          school.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{school.name}</h3>
                        <p className="text-sm text-gray-500">{school.type} - {school.city}</p>
                      </div>
                    </div>
                    {school.is_partner && (
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                        Partenaire
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {school.description || 'Aucune description disponible.'}
                  </p>

                  {school.programs && school.programs.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Filières :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {school.programs.slice(0, 4).map((program, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                            {program}
                          </span>
                        ))}
                        {school.programs.length > 4 && (
                          <span className="text-gray-400 text-xs px-1">+{school.programs.length - 4}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-3 text-xs text-gray-500">
                      {school.student_count && (
                        <span>{school.student_count.toLocaleString('fr-FR')} étudiants</span>
                      )}
                    </div>
                    {school.website_url && (
                      <a
                        href={school.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Visiter le site
                      </a>
                    )}
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

export default Schools;
