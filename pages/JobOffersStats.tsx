import React, { useState, useEffect } from 'react';
import { jobOffersService } from '../services/jobOffersService';

const JobOffersStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const statsData = await jobOffersService.getJobOffersStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading job offers stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistiques non disponibles</h2>
          <p className="text-gray-500">Impossible de charger les statistiques des offres d'emploi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistiques des Offres d'Emploi</h1>
        <p className="text-gray-600 mt-2">Analyse des offres d'emploi disponibles dans notre base de données</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Offres</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOffers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">💼</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Types de Contrats</p>
              <p className="text-3xl font-bold text-gray-900">{stats.contractStats.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Villes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.cityStats.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">🏙️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Métiers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.jobTitleStats.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl">👨‍💼</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Types de Contrats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition par Type de Contrat</h2>
          <div className="space-y-4">
            {stats.contractStats.map((stat: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {stat.type_contrat}
                  </p>
                  <p className="text-sm text-gray-600">
                    {stat.count} offre(s)
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(stat.count / stats.totalOffers) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Villes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition par Ville</h2>
          <div className="space-y-4">
            {stats.cityStats.map((stat: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {stat.ville}
                  </p>
                  <p className="text-sm text-gray-600">
                    {stat.count} offre(s)
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(stat.count / stats.totalOffers) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métiers les plus recherchés */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Métiers les plus recherchés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.jobTitleStats.map((stat: any, index: number) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
                <p className="font-bold text-gray-900 mb-1">{stat.emploi_metier}</p>
                <p className="text-sm text-gray-600">{stat.count} offre(s)</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dernières offres */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dernières Offres Ajoutées</h2>
        <div className="space-y-4">
          {/* Ici vous pourriez ajouter une liste des dernières offres */}
          <p className="text-gray-600">Cette section affichera les dernières offres ajoutées à la base de données.</p>
        </div>
      </div>
    </div>
  );
};

export default JobOffersStats;