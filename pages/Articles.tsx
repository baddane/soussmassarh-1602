
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { articlesService, Article } from '../services/articlesService';

const Articles: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState('');

  // Load categories once
  useEffect(() => {
    articlesService.getCategories().then(setCategories).catch(() => {});
  }, []);

  // Load articles with filters
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const hasFilters = search || selectedCategory;

        if (hasFilters) {
          const data = await articlesService.searchArticles({
            category: selectedCategory || undefined,
            search: search || undefined,
          });
          setArticles(data);
        } else {
          const data = await articlesService.getAllArticles();
          setArticles(data);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">Conseils Carrière & Actualités</h1>
        <p className="text-gray-500 mt-2">
          Nos articles pour vous aider à réussir votre recherche d'emploi dans le Souss-Massa.
        </p>
      </div>

      {/* Filtres inline */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un article..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-gray-500 text-lg">Aucun article trouvé</h3>
          <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/conseils/${article.slug}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all text-left group"
            >
              {article.cover_image_url ? (
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                  <span className="text-4xl">
                    {article.category === 'Entretien' ? '🤝' :
                     article.category === 'Conseils CV' ? '📄' :
                     article.category === 'Marché emploi' ? '📊' :
                     article.category === 'Formation' ? '🎓' :
                     article.category === 'Droit du travail' ? '⚖️' : '📰'}
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {article.read_time_minutes} min
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{article.author_name}</span>
                  <span>
                    {new Date(article.published_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
